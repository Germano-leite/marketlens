package com.techchallenge.marketlens.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity // Diz ao Spring que isso é uma tabela no banco
@Data // O Lombok cria Getters, Setters e ToString automaticamente
@NoArgsConstructor // Cria construtor vazio (obrigatório para JPA)
@AllArgsConstructor // Cria construtor com todos os argumentos
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supermarketName; // Ex: "Carrefour"
    
    private LocalDateTime date; // Data da compra
    
    private Double totalAmount; // Valor total da notinha

    // Relacionamento: Uma nota tem VÁRIOS itens (OneToMany)
    // cascade = CascadeType.ALL: Se eu salvar a nota, salva os itens automaticamente.
    // orphanRemoval = true: Se eu deletar a nota, deleta os itens.
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductItem> items = new ArrayList<>();
}