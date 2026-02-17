package com.techchallenge.marketlens.controller;

import com.techchallenge.marketlens.domain.ProductItem;
import com.techchallenge.marketlens.domain.Receipt;
import com.techchallenge.marketlens.repository.ProductItemRepository;
import com.techchallenge.marketlens.repository.ReceiptRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime; // <--- Importante para o DTO
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ProductItemController {

    private final ProductItemRepository itemRepository;
    private final ReceiptRepository receiptRepository;

    public ProductItemController(ProductItemRepository itemRepository, ReceiptRepository receiptRepository) {
        this.itemRepository = itemRepository;
        this.receiptRepository = receiptRepository;
    }

    // 1. Atualizar um Item (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<ProductItem> updateItem(@PathVariable Long id, @RequestBody ProductItem updatedData) {
        return itemRepository.findById(id).map(item -> {
            item.setProductName(updatedData.getProductName());
            item.setCategory(updatedData.getCategory());
            item.setSubCategory(updatedData.getSubCategory());
            item.setQuantity(updatedData.getQuantity());
            item.setUnit(updatedData.getUnit());
            item.setUnitPrice(updatedData.getUnitPrice());
            item.setTotalPrice(updatedData.getUnitPrice() * updatedData.getQuantity());

            ProductItem savedItem = itemRepository.save(item);

            // Recalcula o total da Nota Pai
            Receipt receipt = item.getReceipt();
            double newTotal = receipt.getItems().stream()
                    .mapToDouble(ProductItem::getTotalPrice)
                    .sum();
            receipt.setTotalAmount(newTotal);
            receiptRepository.save(receipt);

            return ResponseEntity.ok(savedItem);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 2. Busca de SUGESTÕES (Retorna apenas nomes strings)
    @GetMapping("/search")
    public List<String> searchProductNames(@RequestParam String name) {
        // Usa o método searchAny que criamos no Repository
        // Se der erro aqui, certifique-se que criou o searchAny no ProductItemRepository
        List<ProductItem> items = itemRepository.searchAny(name); 
        
        return items.stream()
                .map(ProductItem::getProductName)
                .distinct() // Remove duplicatas
                .sorted()   // Ordena A-Z
                .collect(Collectors.toList());
    }

    // 3. Busca de HISTÓRICO EXATO (Para o Gráfico)
    @GetMapping("/history")
    public List<PriceHistoryDTO> getProductHistory(@RequestParam String exactName) {
        List<ProductItem> items = itemRepository.findByProductNameContainingIgnoreCase(exactName);
        
        return items.stream()
                .map(item -> new PriceHistoryDTO(
                        item.getId(),
                        item.getProductName(),
                        item.getUnitPrice(),
                        item.getReceipt().getDate(),
                        item.getReceipt().getSupermarketName()
                ))
                .sorted((a, b) -> a.date().compareTo(b.date())) // Ordena por data
                .collect(Collectors.toList());
    }

    // 4. Busca histórico POR CATEGORIA (Ex: Histórico de "Leite" independente da marca)
    @GetMapping("/category-history")
    public List<PriceHistoryDTO> getCategoryHistory(@RequestParam String categoryName) {
        // Busca tudo que tem essa subcategoria (Ex: "Feijão", "Arroz", "Leite")
        // Precisamos criar esse método no Repository logo abaixo
        List<ProductItem> items = itemRepository.findBySubCategoryIgnoreCase(categoryName);
        
        return items.stream()
                .map(item -> new PriceHistoryDTO(
                        item.getId(),
                        item.getProductName(), // Mantemos o nome original para saber qual marca era no tooltip
                        item.getUnitPrice(),
                        item.getReceipt().getDate(),
                        item.getReceipt().getSupermarketName()
                ))
                .sorted((a, b) -> a.date().compareTo(b.date()))
                .collect(Collectors.toList());
    }

    // 5. Melhoria na Busca: Retorna Sugestões MISTAS (Produtos E Categorias)
    @GetMapping("/search-smart")
    public List<SearchResultDTO> searchSmart(@RequestParam String name) {
        List<ProductItem> items = itemRepository.searchAny(name);

        // Extrai nomes de produtos únicos
        List<SearchResultDTO> products = items.stream()
                .map(i -> new SearchResultDTO(i.getProductName(), "PRODUTO"))
                .distinct()
                .collect(Collectors.toList());

        // Extrai subcategorias únicas (Ex: "Leite", "Arroz")
        List<SearchResultDTO> categories = items.stream()
                .map(i -> new SearchResultDTO(i.getSubCategory(), "CATEGORIA"))
                .filter(dto -> dto.name() != null && !dto.name().isEmpty()) // Remove nulos
                .distinct()
                .collect(Collectors.toList());

        // Junta tudo (Categorias primeiro, depois produtos)
        categories.addAll(products);
        
        // Filtra para garantir que o termo buscado está no nome (limpeza final)
        String termo = name.toLowerCase();
        return categories.stream()
                .filter(i -> i.name().toLowerCase().contains(termo))
                .sorted((a, b) -> a.type().compareTo(b.type())) // Categoria vem antes de Produto alfabeticamente
                .limit(10) // Limita a 10 resultados para não poluir
                .collect(Collectors.toList());
    }

    // DTO auxiliar para o Search Smart
    public record SearchResultDTO(
            String name, 
            String type
    ) {}

    // DTO para o histórico de preços
    public record PriceHistoryDTO(
            Long id, 
            String productName, 
            Double price, 
            LocalDateTime date, 
            String supermarket
    ) {}
}