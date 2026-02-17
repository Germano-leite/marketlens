package com.techchallenge.marketlens.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    //private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestClient restClient;

    public AIService() {
        this.restClient = RestClient.create();
    }
    
    
    public String analyzeReceiptImage(byte[] imageBytes) {
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);

        String prompt = """
            Analise esta imagem de cupom fiscal.
            Extraia os dados em JSON estrito.
            
            Regras de Categorização:
            1. 'category': Escolha uma das Macro-Categorias: [ACOGUE, PADARIA, LATICINIOS, HORTIFRUTI, LIMPEZA, BEBIDAS, MERCEARIA, HIGIENE, OUTROS].
            2. 'subCategory': Seja ESPECÍFICO sobre o produto. 
               - NÃO use termos genéricos como 'Roupas', 'Grãos' ou 'Bovinos'.
               - USE o nome do produto: 'Sabão em Pó', 'Água Sanitária', 'Arroz', 'Feijão', 'Picanha', 'Filé de Frango'.
            
            Retorne APENAS este JSON:
            {
                "supermarketName": "Nome",
                "date": "2024-02-20T10:00:00",
                "totalAmount": 0.00,
                "items": [
                    {
                        "productName": "Nome Completo",
                        "category": "MACRO_CATEGORIA",
                        "subCategory": "TIPO_ESPECIFICO",
                        "quantity": 1.0,
                        "unit": "UN",
                        "unitPrice": 0.00,
                        "totalPrice": 0.00
                    }
                ]
            }
            """;
            
        var requestBody = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt),
                    Map.of("inline_data", Map.of(
                        "mime_type", "image/jpeg",
                        "data", base64Image
                    ))
                ))
            )
        );

        try {
            System.out.println("--- ENVIANDO REQUISICAO PARA O GEMINI ---");
            String response = restClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(String.class);

            // O ESPIÃO: Imprime a resposta bruta no console
            System.out.println("--- RESPOSTA BRUTA DO GEMINI ---");
            System.out.println(response);
            System.out.println("--------------------------------");

            return extractJsonFromResponse(response);
        } catch (Exception e) {
            // Se der erro 400/404/500, o RestClient joga Exception aqui
            System.err.println("ERRO NA CHAMADA HTTP: " + e.getMessage());
            throw new RuntimeException("Erro ao chamar a IA: " + e.getMessage());
        }
    }


    private String extractJsonFromResponse(String geminiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            var rootNode = mapper.readTree(geminiResponse);

            // 1. Verifica erro
            if (rootNode.has("error")) {
                throw new RuntimeException("Erro da API: " + rootNode.get("error").toPrettyString());
            }

            // 2. Navegação Segura no JSON do Gemini 2.5+
            // Caminho: candidates[0] -> content -> parts[0] -> text
            
            var candidates = rootNode.path("candidates");
            if (candidates.isEmpty()) {
                 throw new RuntimeException("Sem candidatos na resposta.");
            }

            var firstCandidate = candidates.get(0);
            var content = firstCandidate.path("content"); // Content é Objeto, não Array
            var parts = content.path("parts"); // Parts é que é o Array
            
            if (parts.isEmpty()) {
                 throw new RuntimeException("Conteúdo vazio (sem parts).");
            }

            String text = parts.get(0).path("text").asText();
            
            // Limpeza do Markdown (remove ```json e ```)
            return text.replace("```json", "")
                       .replace("```", "")
                       .trim();

        } catch (Exception e) {
            // Se der erro, o log bruto lá em cima já nos mostrou o porquê,
            // mas aqui garantimos que o Java não crashe.
            throw new RuntimeException("Erro ao extrair JSON: " + e.getMessage(), e);
        }
    }
}




