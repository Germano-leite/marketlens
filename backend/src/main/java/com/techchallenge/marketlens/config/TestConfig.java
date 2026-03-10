// package com.techchallenge.marketlens.config;

// import com.techchallenge.marketlens.domain.ProductItem;
// import com.techchallenge.marketlens.domain.Receipt;
// import com.techchallenge.marketlens.repository.ReceiptRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Profile;

// import java.time.LocalDateTime;
// import java.util.ArrayList;
// import java.util.Arrays;

// @Configuration
// @Profile("!prod") // Isso garante que só roda em desenvolvimento, nunca em produção
// public class TestConfig {

//     @Bean
//     public CommandLineRunner dataLoader(ReceiptRepository receiptRepository) {
//         return args -> {
//             // Limpa o banco para não duplicar com os dados antigos "errados"
//             receiptRepository.deleteAll(); 

//             System.out.println("🌱 SEEDING: Plantando dados PADRONIZADOS no banco...");

//             // ==========================================
//             // --- JANEIRO 2026 ---
//             // ==========================================

//             // 1. Compra Mensal (Grande) - Início de Janeiro
//             Receipt r1 = createReceipt("Supermercado Preço Bom", LocalDateTime.of(2026, 1, 5, 10, 30));
//             addItem(r1, "Arroz", "MERCEARIA", "Arroz", 1.0, "UN", 25.90); 
//             addItem(r1, "Feijão", "MERCEARIA", "Feijão", 3.0, "UN", 8.50);
//             addItem(r1, "Macarrão", "MERCEARIA", "Macarrão", 4.0, "UN", 4.20);
//             addItem(r1, "Leite", "LATICINIOS", "Leite", 12.0, "UN", 4.80);
//             addItem(r1, "Manteiga", "LATICINIOS", "Manteiga", 1.0, "UN", 12.50);
//             addItem(r1, "Carne Bovina", "ACOGUE", "Carne Bovina", 2.5, "KG", 42.90);
//             addItem(r1, "Peito de Frango", "ACOGUE", "Frango", 2.0, "KG", 19.90);
//             addItem(r1, "Ovos", "MERCEARIA", "Ovos", 2.0, "UN", 17.90);
//             addItem(r1, "Pão", "PADARIA", "Pão", 2.0, "UN", 8.50);
//             calculateTotal(r1);

//             // 2. Compra Semanal (Reposição Menor) - Meados de Janeiro
//             Receipt r2 = createReceipt("Mercadão da Cidade", LocalDateTime.of(2026, 1, 15, 18, 15));
//             addItem(r2, "Leite", "LATICINIOS", "Leite", 6.0, "UN", 4.80);
//             addItem(r2, "Pão", "PADARIA", "Pão", 1.0, "UN", 8.50);
//             addItem(r2, "Sobrecoxa de Frango", "ACOGUE", "Frango", 1.5, "KG", 14.90);
//             addItem(r2, "Macarrão", "MERCEARIA", "Macarrão", 2.0, "UN", 4.20);
//             calculateTotal(r2);

//             // 3. Compra Semanal (Reposição Menor) - Fim de Janeiro
//             Receipt r3 = createReceipt("Supermercado Preço Bom", LocalDateTime.of(2026, 1, 24, 9, 0));
//             addItem(r3, "Leite", "LATICINIOS", "Leite", 6.0, "UN", 4.90);
//             addItem(r3, "Ovos", "MERCEARIA", "Ovos", 1.0, "UN", 18.50);
//             addItem(r3, "Carne Bovina", "ACOGUE", "Carne Bovina", 1.2, "KG", 44.90);
//             addItem(r3, "Pão", "PADARIA", "Pão", 2.0, "UN", 8.50);
//             calculateTotal(r3);

//             // ==========================================
//             // --- FEVEREIRO 2026 ---
//             // ==========================================

//             // 4. Compra Mensal (Grande) - Início de Fevereiro (com leve inflação simulada)
//             Receipt r4 = createReceipt("Carrefour Bairro", LocalDateTime.of(2026, 2, 6, 11, 0));
//             addItem(r4, "Arroz", "MERCEARIA", "Arroz", 1.0, "UN", 26.50);
//             addItem(r4, "Feijão", "MERCEARIA", "Feijão", 4.0, "UN", 8.20);
//             addItem(r4, "Macarrão", "MERCEARIA", "Macarrão", 5.0, "UN", 4.50);
//             addItem(r4, "Leite", "LATICINIOS", "Leite", 12.0, "UN", 5.10);
//             addItem(r4, "Manteiga", "LATICINIOS", "Manteiga", 2.0, "UN", 12.90);
//             addItem(r4, "Carne Bovina", "ACOGUE", "Carne Bovina", 3.0, "KG", 45.00);
//             addItem(r4, "Sobrecoxa de Frango", "ACOGUE", "Frango", 2.5, "KG", 15.50);
//             addItem(r4, "Ovos", "MERCEARIA", "Ovos", 2.0, "UN", 18.00);
//             addItem(r4, "Pão", "PADARIA", "Pão", 3.0, "UN", 8.90);
//             calculateTotal(r4);

//             // 5. Compra Semanal (Reposição Menor) - Meados de Fevereiro
//             Receipt r5 = createReceipt("Mercadão da Cidade", LocalDateTime.of(2026, 2, 16, 17, 30));
//             addItem(r5, "Leite", "LATICINIOS", "Leite", 6.0, "UN", 5.10);
//             addItem(r5, "Pão", "PADARIA", "Pão", 1.0, "UN", 8.90);
//             addItem(r5, "Peito de Frango", "ACOGUE", "Frango", 1.5, "KG", 20.50);
//             addItem(r5, "Feijão", "MERCEARIA", "Feijão", 1.0, "UN", 8.20);
//             calculateTotal(r5);

//             // 6. Compra Semanal (Reposição Menor) - Fim de Fevereiro
//             Receipt r6 = createReceipt("Carrefour Bairro", LocalDateTime.of(2026, 2, 25, 10, 15));
//             addItem(r6, "Leite", "LATICINIOS", "Leite", 6.0, "UN", 5.10);
//             addItem(r6, "Ovos", "MERCEARIA", "Ovos", 1.0, "UN", 18.50);
//             addItem(r6, "Carne Bovina", "ACOGUE", "Carne Bovina", 1.0, "KG", 45.00);
//             addItem(r6, "Pão", "PADARIA", "Pão", 1.0, "UN", 8.90);
//             calculateTotal(r6);

//             receiptRepository.saveAll(Arrays.asList(r1, r2, r3, r4, r5, r6));
//             System.out.println("🌳 SEEDING: 6 Notas Fiscais criadas com sucesso! (Jan/Fev 2026)");
//         };
//     }

//     // --- Métodos Auxiliares ---

//     private Receipt createReceipt(String market, LocalDateTime date) {
//         Receipt r = new Receipt();
//         r.setSupermarketName(market);
//         r.setDate(date);
//         r.setItems(new ArrayList<>());
//         return r;
//     }

//     private void addItem(Receipt receipt, String name, String cat, String subCat, Double qtd, String unit, Double price) {
//         ProductItem item = new ProductItem();
//         item.setProductName(name);
//         item.setCategory(cat);
//         item.setSubCategory(subCat);
//         item.setQuantity(qtd);
//         item.setUnit(unit);
//         item.setUnitPrice(price);
//         item.setTotalPrice(price * qtd);
//         item.setReceipt(receipt); // Vincula ao pai
//         receipt.getItems().add(item);
//     }

//     private void calculateTotal(Receipt r) {
//         double total = r.getItems().stream().mapToDouble(ProductItem::getTotalPrice).sum();
//         r.setTotalAmount(total);
//     }
// }