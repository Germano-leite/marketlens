package com.techchallenge.marketlens.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.techchallenge.marketlens.domain.Receipt;
import com.techchallenge.marketlens.repository.ReceiptRepository;
import com.techchallenge.marketlens.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "*") // Importante: Permite que o React acesse sem bloqueio
public class ReceiptController {

    private final AIService aiService;
    private final ReceiptRepository repository;
    private final ObjectMapper objectMapper;

    public ReceiptController(AIService aiService, ReceiptRepository repository) {
        this.aiService = aiService;
        this.repository = repository;
        
        // Configura o Jackson para entender datas (LocalDateTime)
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadReceipt(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Envia imagem para a IA e recebe JSON (String)
            System.out.println("Recebendo imagem... enviando para o Gemini.");
            String jsonResult = aiService.analyzeReceiptImage(file.getBytes());
            System.out.println("Resposta da IA: " + jsonResult);

            // 2. Converte o JSON da IA para a Entidade Receipt
            Receipt receipt = objectMapper.readValue(jsonResult, Receipt.class);

            // 3. Vincula os itens à nota (Consistência do Banco de Dados)
            // O JSON cria a Nota e os Itens, mas não diz aos itens "quem é o pai deles".
            if (receipt.getItems() != null) {
                receipt.getItems().forEach(item -> item.setReceipt(receipt));
            }

            // 4. Salva no Banco (Salva a nota e os itens em cascata)
            Receipt savedReceipt = repository.save(receipt);

            // 5. Retorna sucesso
            return ResponseEntity.ok(savedReceipt);

        } catch (Exception e) {
            e.printStackTrace(); // Imprime o erro no console para debugarmos
            return ResponseEntity.internalServerError().body("Erro: " + e.getMessage());
        }
    }
        
    @GetMapping
    public ResponseEntity<?> getAllReceipts() {
        return ResponseEntity.ok(repository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReceipt(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        
        repository.deleteById(id);
        return ResponseEntity.noContent().build(); // Retorna 204 (Sucesso sem conteúdo)
    }
}
