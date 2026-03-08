package com.techchallenge.marketlens.dto;

import com.techchallenge.marketlens.domain.ShoppingCategory;

public class ShoppingListItemDTO {
    
    private String itemName;
    private Double quantity;
    private String unit; // Ex: "unidades", "kg", "pacotes"
    private ShoppingCategory category;
    private Double unitPrice = 0.0;

    public ShoppingListItemDTO() {}

    public ShoppingListItemDTO(String itemName, Double quantity, String unit, ShoppingCategory category) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.unit = unit;
        this.category = category;
    }

    // Getters e Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public ShoppingCategory getCategory() { return category; }
    public void setCategory(ShoppingCategory category) { this.category = category; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

}