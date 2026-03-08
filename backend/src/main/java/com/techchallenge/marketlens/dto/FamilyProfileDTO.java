package com.techchallenge.marketlens.dto;

import java.math.BigDecimal;

public class FamilyProfileDTO {
    
    private Integer adultsCount;
    private Integer childrenCount;
    private BigDecimal monthlyBudget;

    public FamilyProfileDTO() {}

    // Getters e Setters
    public Integer getAdultsCount() { return adultsCount; }
    public void setAdultsCount(Integer adultsCount) { this.adultsCount = adultsCount; }

    public Integer getChildrenCount() { return childrenCount; }
    public void setChildrenCount(Integer childrenCount) { this.childrenCount = childrenCount; }

    public BigDecimal getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(BigDecimal monthlyBudget) { this.monthlyBudget = monthlyBudget; }
}