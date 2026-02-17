package com.techchallenge.marketlens.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName; // Ex: "Leite Integral Italac"
    
    private String category;    // Ex: "LATICINIOS" (Categoria Macro)
    
    private String subCategory; // Ex: "LEITE" (Para futuro detalhamento)
    
    private Double quantity;    // Ex: 2.0
    
    private String unit;        // Ex: "UN", "KG", "LT"
    
    private Double unitPrice;   // Ex: 4.59
    
    private Double totalPrice;  // Ex: 9.18

    // Relacionamento: Vários itens pertencem a UMA nota (ManyToOne)
    @ManyToOne
    @JoinColumn(name = "receipt_id") // Cria a coluna de chave estrangeira
    @JsonIgnore // Importante: Evita loop infinito ao transformar em JSON
    private Receipt receipt;
}