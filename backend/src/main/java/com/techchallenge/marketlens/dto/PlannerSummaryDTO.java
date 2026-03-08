package com.techchallenge.marketlens.dto;

import java.math.BigDecimal;
import java.util.List;

public class PlannerSummaryDTO {
    
    // O Orçamento (Aquelas "Carteiras Virtuais" do frontend)
    private BigDecimal totalBudget;
    private BigDecimal monthlyEstimatedCost; // Custo estimado dos itens base
    private BigDecimal weeklyReserve;        // Verba pra feira e padaria
    private BigDecimal leisureReserve;       // Verba livre/lazer

    // A Lista de Compras Física
    private List<ShoppingListItemDTO> items;

    public PlannerSummaryDTO() {}

    // Getters e Setters
    public BigDecimal getTotalBudget() { return totalBudget; }
    public void setTotalBudget(BigDecimal totalBudget) { this.totalBudget = totalBudget; }

    public BigDecimal getMonthlyEstimatedCost() { return monthlyEstimatedCost; }
    public void setMonthlyEstimatedCost(BigDecimal monthlyEstimatedCost) { this.monthlyEstimatedCost = monthlyEstimatedCost; }

    public BigDecimal getWeeklyReserve() { return weeklyReserve; }
    public void setWeeklyReserve(BigDecimal weeklyReserve) { this.weeklyReserve = weeklyReserve; }

    public BigDecimal getLeisureReserve() { return leisureReserve; }
    public void setLeisureReserve(BigDecimal leisureReserve) { this.leisureReserve = leisureReserve; }

    public List<ShoppingListItemDTO> getItems() { return items; }
    public void setItems(List<ShoppingListItemDTO> items) { this.items = items; }
}