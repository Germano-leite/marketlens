package com.techchallenge.marketlens.service;

import com.techchallenge.marketlens.domain.FamilyProfile;
import com.techchallenge.marketlens.domain.ItemAdjustment;
import com.techchallenge.marketlens.domain.ShoppingCategory;
import com.techchallenge.marketlens.dto.PlannerSummaryDTO;
import com.techchallenge.marketlens.dto.ShoppingListItemDTO;
import com.techchallenge.marketlens.repository.FamilyProfileRepository;
import com.techchallenge.marketlens.repository.ItemAdjustmentRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class PlannerService {

    private final FamilyProfileRepository profileRepository;
    private final ItemAdjustmentRepository adjustmentRepository;
    private final com.techchallenge.marketlens.repository.ProductItemRepository productItemRepository;

    // Injeção de dependência via construtor (Boa prática do Spring Boot)
    public PlannerService(FamilyProfileRepository profileRepository, 
                          ItemAdjustmentRepository adjustmentRepository,
                          com.techchallenge.marketlens.repository.ProductItemRepository productItemRepository) {
        this.profileRepository = profileRepository;
        this.adjustmentRepository = adjustmentRepository;
        this.productItemRepository = productItemRepository;
    }

    public PlannerSummaryDTO generateMonthlyPlan() {
        // 1. Busca o perfil da família. 
        // (Se não houver nenhum no banco ainda, criamos um mock temporário para o MVP não quebrar)
        FamilyProfile profile = profileRepository.findFirstByOrderByIdAsc();
        if (profile == null) {
            profile = new FamilyProfile(2, 1, new BigDecimal("1500.00")); 
        }

        int totalPeople = profile.getAdultsCount() + profile.getChildrenCount();
        BigDecimal budget = profile.getMonthlyBudget();

        // 2. Separa as verbas (Exemplo: 20% Lazer, 40% Feira/Padaria/Acougue, o Resto é a Base)
        BigDecimal leisureReserve = budget.multiply(new BigDecimal("0.20"));
        BigDecimal weeklyReserve = budget.multiply(new BigDecimal("0.40"));
        BigDecimal baseMonthlyCost = budget.subtract(leisureReserve).subtract(weeklyReserve);

        // 3. Monta a "Carcaça" da Resposta (DTO)
        PlannerSummaryDTO summary = new PlannerSummaryDTO();
        summary.setTotalBudget(budget);
        summary.setLeisureReserve(leisureReserve);
        summary.setWeeklyReserve(weeklyReserve);
        summary.setMonthlyEstimatedCost(baseMonthlyCost); // Na V2, isso virá da soma dos preços do histórico

        // 4. Gera a lista e passa pelo filtro inteligente
        List<ShoppingListItemDTO> draftList = generateBaseList(profile.getAdultsCount(), profile.getChildrenCount(), totalPeople);
        List<ShoppingListItemDTO> finalAdjustedList = applyUserAdjustments(draftList);

        // ==========================================
        // INJEÇÃO DE HISTÓRICO (ESSENCIAIS DOS ÚLTIMOS 60 DIAS)
        // ==========================================
        java.time.LocalDateTime sessentaDiasAtras = java.time.LocalDateTime.now().minusDays(60);
        List<String> lastMonthEssentials = productItemRepository.findEssentialItemsSince(sessentaDiasAtras);
        
        for (String historyItemName : lastMonthEssentials) {
            
            // Trava 1: Já está na lista de Arroz/Feijão padrão?
            boolean alreadyInList = finalAdjustedList.stream()
                .anyMatch(item -> item.getItemName().equalsIgnoreCase(historyItemName));
            
            Optional<ItemAdjustment> adjustmentOpt = adjustmentRepository.findByItemNameIgnoreCase(historyItemName);
            
            // Trava 2: O React manda fator 0.0 quando o usuário clica na Lixeira
            boolean isDeleted = adjustmentOpt.isPresent() && adjustmentOpt.get().getAdjustmentFactor() <= 0.1;
            
            // Trava 3: O React manda fator > 1.0 (ex: 1.2) quando clica no "+"
            boolean isPromoted = adjustmentOpt.isPresent() && adjustmentOpt.get().getAdjustmentFactor() > 0.5;

            if (!alreadyInList && !isDeleted) {
                if (isPromoted) {
                    double qty = Math.max(1.0, Math.round(adjustmentOpt.get().getAdjustmentFactor()));
                    
                    // 👇 A MÁGICA ENTRA AQUI 👇
                    // Lista rápida de palavras que pertencem à feira/padaria
                    List<String> itensSemanais = java.util.Arrays.asList(
                        "Leite", "Pão", "Carne", "Frango", "Peixe", "Ovo", "Queijo", "Presunto", "Fruta", "Verdura", "Legume"
                    );
                    
                    // Verifica se o nome do item bate com algum da lista semanal
                    boolean isSemanal = itensSemanais.stream()
                        .anyMatch(palavra -> historyItemName.toLowerCase().contains(palavra.toLowerCase()));
                        
                    // Define a categoria correta com base na verificação
                    ShoppingCategory categoriaDestino = isSemanal ? ShoppingCategory.SEMANAL_FRESCOS : ShoppingCategory.MENSAL_BASE;
                    
                    // Adiciona o item na categoria certa!
                    finalAdjustedList.add(new ShoppingListItemDTO(historyItemName, qty, "un", categoriaDestino));
                    
                } else {
                    finalAdjustedList.add(new ShoppingListItemDTO(historyItemName, 1.0, "un", ShoppingCategory.SUGESTAO_HISTORICO));
                }
            }    
        }
        
        // ==========================================
        // RESGATE DE ITENS ADICIONADOS MANUALMENTE (QUE NÃO ESTÃO NO HISTÓRICO)
        // ==========================================
        List<ItemAdjustment> todosAjustes = adjustmentRepository.findAll();
        
        for (ItemAdjustment ajuste : todosAjustes) {
            String manualItemName = ajuste.getItemName();
            double fator = ajuste.getAdjustmentFactor();
            
            // Ignora se for um item que o usuário excluiu (fator negativo ou zero)
            if (fator <= 0.5) continue;

            // Verifica se o item JÁ FOI colocado na lista pela lógica anterior
            boolean alreadyInList = finalAdjustedList.stream()
                .anyMatch(item -> item.getItemName().equalsIgnoreCase(manualItemName));

            if (!alreadyInList) {
                // Aplica a mesma inteligência de separar MENSAL vs SEMANAL
                List<String> itensSemanais = java.util.Arrays.asList(
                    "Leite", "Pão", "Carne", "Frango", "Peixe", "Ovo", "Queijo", "Presunto", "Fruta", "Verdura", "Legume"
                );
                
                boolean isSemanal = itensSemanais.stream()
                    .anyMatch(palavra -> manualItemName.toLowerCase().contains(palavra.toLowerCase()));
                    
                ShoppingCategory categoriaDestino = isSemanal ? ShoppingCategory.SEMANAL_FRESCOS : ShoppingCategory.MENSAL_BASE;
                
                // Define a quantidade (Mínimo 1)
                double qty = Math.max(1.0, Math.round(fator));
                
                // Adiciona o item fujão na lista final!
                finalAdjustedList.add(new ShoppingListItemDTO(manualItemName, qty, "un", categoriaDestino));
            }
        }
    
        // ==========================================
        // PRECIFICAÇÃO HISTÓRICA OU ESTIMADA
        // ==========================================
        for (ShoppingListItemDTO item : finalAdjustedList) {
            // Usa a primeira palavra do item (Ex: de "Leite Integral" busca só "Leite") para achar nas notas fiscais
            String keyword = item.getItemName().split(" ")[0]; 
            Double avgPrice = productItemRepository.findAverageHistoricalPrice(keyword);
            
            // Se o usuário nunca comprou isso nas notas fiscais antigas, usamos um preço médio estimado do mercado (Fallback)
            if (avgPrice == null || avgPrice == 0.0) {
                avgPrice = getFallbackEstimatedPrice(keyword);
            }
            
            // Arredonda para 2 casas decimais (Ex: 4.59)
            item.setUnitPrice(Math.round(avgPrice * 100.0) / 100.0);
        }

        summary.setItems(finalAdjustedList);
        return summary;
    }

    // ==========================================
    // SALVAR PERFIL DA FAMÍLIA
    // ==========================================
    public void saveProfile(com.techchallenge.marketlens.dto.FamilyProfileDTO dto) {
        FamilyProfile profile = profileRepository.findFirstByOrderByIdAsc();
        
        if (profile == null) {
            profile = new FamilyProfile();
        }
        
        profile.setAdultsCount(dto.getAdultsCount());
        profile.setChildrenCount(dto.getChildrenCount());
        profile.setMonthlyBudget(dto.getMonthlyBudget());
        
        profileRepository.save(profile);
    }

    // ==========================================
    // MÉTODOS PRIVADOS (A LÓGICA DO MOTOR)
    // ==========================================

    private List<ShoppingListItemDTO> generateBaseList(int adults, int children, int totalPeople) {
        List<ShoppingListItemDTO> list = new ArrayList<>();

        // ==========================================
        // 🍞 1. CESTA BÁSICA (MENSAL_BASE)
        // ==========================================
        double arrozQtd = Math.ceil(((adults * 3.0) + (children * 1.5)) / 5.0);
        list.add(new ShoppingListItemDTO("Arroz", arrozQtd, "pcts 5kg", ShoppingCategory.MENSAL_BASE));
        
        double feijaoQtd = Math.ceil((adults * 1.5) + (children * 0.5));
        list.add(new ShoppingListItemDTO("Feijão", feijaoQtd, "kg", ShoppingCategory.MENSAL_BASE));

        list.add(new ShoppingListItemDTO("Óleo de Soja", Math.ceil(totalPeople * 1.0), "frascos", ShoppingCategory.MENSAL_BASE));
        list.add(new ShoppingListItemDTO("Açúcar", Math.ceil(totalPeople * 1.0), "kg", ShoppingCategory.MENSAL_BASE));
        list.add(new ShoppingListItemDTO("Café", Math.ceil(adults * 0.5), "kg", ShoppingCategory.MENSAL_BASE));
        list.add(new ShoppingListItemDTO("Farinha (Trigo/Mandioca)", Math.ceil(totalPeople * 0.5), "kg", ShoppingCategory.MENSAL_BASE));
        list.add(new ShoppingListItemDTO("Macarrão", Math.ceil(totalPeople * 1.0), "pacotes", ShoppingCategory.MENSAL_BASE));

        // ==========================================
        // 🥩 2. FRESCOS E PROTEÍNAS (SEMANAL)
        // ==========================================
        double proteinaKg = Math.ceil((adults * 2.1) + (children * 0.7));
        list.add(new ShoppingListItemDTO("Carnes/Proteínas", proteinaKg, "kg", ShoppingCategory.SEMANAL_FRESCOS));
        
        double ovosSemanal = Math.ceil(totalPeople * 1.0); // 1 Dúzia por pessoa/semana
        list.add(new ShoppingListItemDTO("Ovos", ovosSemanal, "dúzias", ShoppingCategory.SEMANAL_FRESCOS));

        double leiteSemanal = Math.ceil((adults * 2.0) + (children * 4.0)); // Consumo maior para crianças
        list.add(new ShoppingListItemDTO("Leite", leiteSemanal, "litros", ShoppingCategory.SEMANAL_FRESCOS));


        // ==========================================
        // 🧴 3. HIGIENE E LIMPEZA (MENSAL)
        // ==========================================
        list.add(new ShoppingListItemDTO("Sabonete", totalPeople * 4.0, "un", ShoppingCategory.MENSAL_HIGIENE));
        list.add(new ShoppingListItemDTO("Creme Dental", totalPeople * 1.0, "un", ShoppingCategory.MENSAL_HIGIENE));
        list.add(new ShoppingListItemDTO("Detergente Líquido", 4.0, "un", ShoppingCategory.MENSAL_LIMPEZA));
        list.add(new ShoppingListItemDTO("Sabão em Pó", 2.0, "kg", ShoppingCategory.MENSAL_LIMPEZA));

        return list;
    }

    private List<ShoppingListItemDTO> applyUserAdjustments(List<ShoppingListItemDTO> baseList) {
        List<ShoppingListItemDTO> adjustedList = new ArrayList<>();

        for (ShoppingListItemDTO item : baseList) {
            Optional<ItemAdjustment> adjustmentOpt = adjustmentRepository.findByItemNameIgnoreCase(item.getItemName());

            if (adjustmentOpt.isPresent()) {
                double delta = adjustmentOpt.get().getAdjustmentFactor();
                
                // Se a flag for -999, significa que foi pra lixeira. Ignoramos o item.
                if (delta == -999.0) {
                    continue; 
                } else {
                    // Agora fazemos uma SOMA exata ao invés de porcentagem
                    double finalQty = item.getQuantity() + delta;
                    
                    // Trava de segurança: Nunca deixa a quantidade ficar abaixo de 1 (se quiser excluir, usa a lixeira)
                    if (finalQty < 1.0) {
                        finalQty = 1.0;
                    }
                    
                    // Formatação visual: Deixa as carnes com 1 casa decimal e arredonda os pacotes/unidades
                    if ("kg".equalsIgnoreCase(item.getUnit())) {
                        item.setQuantity(Math.round(finalQty * 10.0) / 10.0);
                    } else {
                        item.setQuantity((double) Math.round(finalQty));
                    }
                    
                    adjustedList.add(item);
                }
            } else {
                adjustedList.add(item);
            }
        }
        return adjustedList;
    }

    private Double getFallbackEstimatedPrice(String keyword) {
        keyword = keyword.toUpperCase();
        if (keyword.contains("ARROZ")) return 25.90;
        if (keyword.contains("FEIJÃO")) return 7.50;
        if (keyword.contains("ÓLEO")) return 6.50;
        if (keyword.contains("AÇÚCAR")) return 4.50;
        if (keyword.contains("CAFÉ")) return 18.90;
        if (keyword.contains("CARNES")) return 35.00;
        if (keyword.contains("OVOS")) return 16.00;
        if (keyword.contains("LEITE")) return 5.50;
        if (keyword.contains("HORTIFRUTI")) return 8.00;
        if (keyword.contains("SABÃO")) return 14.50;
        return 5.00; // Preço genérico de segurança
    }
}