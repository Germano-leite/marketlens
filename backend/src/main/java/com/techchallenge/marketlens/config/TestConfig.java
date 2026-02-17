package com.techchallenge.marketlens.config;

import com.techchallenge.marketlens.domain.ProductItem;
import com.techchallenge.marketlens.domain.Receipt;
import com.techchallenge.marketlens.repository.ReceiptRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;

@Configuration
@Profile("!prod") // Isso garante que só roda em desenvolvimento, nunca em produção
public class TestConfig {

    @Bean
    public CommandLineRunner dataLoader(ReceiptRepository receiptRepository) {
        return args -> {
            // Limpa o banco para não duplicar com os dados antigos "errados"
            receiptRepository.deleteAll(); 

            System.out.println("🌱 SEEDING: Plantando dados DETALHADOS no banco...");

            // --- JANEIRO ---
            Receipt r1 = createReceipt("Supermercado Preço Bom", LocalDateTime.now().minusMonths(2));
            // Antes: "LATICINIOS", "Leite" -> OK
            addItem(r1, "Leite Integral Italac", "LATICINIOS", "Leite", 12.0, "UN", 4.50);
            // Antes: "ACOGUE", "Bovinos" -> Agora: "Carne Bovina" ou o corte específico
            addItem(r1, "Picanha Bovina", "ACOGUE", "Carne Bovina", 1.5, "KG", 69.90);
            // Antes: "LIMPEZA", "Roupas" -> Agora: "Sabão em Pó"
            addItem(r1, "Sabão em Pó Omo", "LIMPEZA", "Sabão em Pó", 1.0, "UN", 18.90);
            calculateTotal(r1);

            // --- FEVEREIRO ---
            Receipt r2 = createReceipt("Mercadão da Cidade", LocalDateTime.now().minusMonths(1));
            addItem(r2, "Leite Integral Italac", "LATICINIOS", "Leite", 12.0, "UN", 4.89);
            // Antes: "MERCEARIA", "Grãos" -> Agora: "Arroz"
            addItem(r2, "Arroz Tio João 5kg", "MERCEARIA", "Arroz", 2.0, "UN", 22.50);
            // Antes: "BEBIDAS", "Refrigerante" -> OK, mas pode ser "Refrigerante Cola"
            addItem(r2, "Coca-Cola 2L", "BEBIDAS", "Refrigerante", 3.0, "UN", 8.99);
            addItem(r2, "Água Sanitária Ypê", "LIMPEZA", "Água Sanitária", 2.0, "UN", 4.50); // Novo item
            calculateTotal(r2);

            // --- MARÇO ---
            Receipt r3 = createReceipt("Carrefour Bairro", LocalDateTime.now().minusDays(2));
            addItem(r3, "Leite Integral Italac", "LATICINIOS", "Leite", 6.0, "UN", 5.49);
            addItem(r3, "Picanha Bovina", "ACOGUE", "Carne Bovina", 2.0, "KG", 75.00);
            addItem(r3, "Feijão Carioca Camil", "MERCEARIA", "Feijão", 4.0, "UN", 8.90); // Novo item
            calculateTotal(r3);

            receiptRepository.saveAll(Arrays.asList(r1, r2, r3));
            System.out.println("🌳 SEEDING: Dados detalhados criados!");
        };
    }

    // --- Métodos Auxiliares para não repetir código ---

    private Receipt createReceipt(String market, LocalDateTime date) {
        Receipt r = new Receipt();
        r.setSupermarketName(market);
        r.setDate(date);
        r.setItems(new ArrayList<>());
        return r;
    }

    private void addItem(Receipt receipt, String name, String cat, String subCat, Double qtd, String unit, Double price) {
        ProductItem item = new ProductItem();
        item.setProductName(name);
        item.setCategory(cat);
        item.setSubCategory(subCat);
        item.setQuantity(qtd);
        item.setUnit(unit);
        item.setUnitPrice(price);
        item.setTotalPrice(price * qtd);
        item.setReceipt(receipt); // Vincula ao pai
        receipt.getItems().add(item);
    }

    private void calculateTotal(Receipt r) {
        double total = r.getItems().stream().mapToDouble(ProductItem::getTotalPrice).sum();
        r.setTotalAmount(total);
    }
}