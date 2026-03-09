package com.techchallenge.marketlens.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "item_adjustments")
public class ItemAdjustment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O nome do produto (ex: "Arroz", "Shampoo")
    @Column(nullable = false, unique = true) 
    private String itemName;

    // O multiplicador: 1.0 (Padrão), 1.2 (Faltou), 0.8 (Sobrou), 0.0 (Excluído)
    @Column(nullable = false)
    private Double adjustmentFactor;

    public ItemAdjustment() {}

    public ItemAdjustment(String itemName, Double adjustmentFactor) {
        this.itemName = itemName;
        this.adjustmentFactor = adjustmentFactor;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Double getAdjustmentFactor() { return adjustmentFactor; }
    public void setAdjustmentFactor(Double adjustmentFactor) { this.adjustmentFactor = adjustmentFactor; }
}