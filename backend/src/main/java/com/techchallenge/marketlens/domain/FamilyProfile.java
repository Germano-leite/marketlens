package com.techchallenge.marketlens.domain; // Ajuste para o nome do seu pacote

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "family_profiles")
public class FamilyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer adultsCount;

    @Column(nullable = false)
    private Integer childrenCount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal monthlyBudget;

    // Construtor vazio exigido pelo JPA
    public FamilyProfile() {}

    public FamilyProfile(Integer adultsCount, Integer childrenCount, BigDecimal monthlyBudget) {
        this.adultsCount = adultsCount;
        this.childrenCount = childrenCount;
        this.monthlyBudget = monthlyBudget;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getAdultsCount() { return adultsCount; }
    public void setAdultsCount(Integer adultsCount) { this.adultsCount = adultsCount; }

    public Integer getChildrenCount() { return childrenCount; }
    public void setChildrenCount(Integer childrenCount) { this.childrenCount = childrenCount; }

    public BigDecimal getMonthlyBudget() { return monthlyBudget; }
    public void setMonthlyBudget(BigDecimal monthlyBudget) { this.monthlyBudget = monthlyBudget; }
}