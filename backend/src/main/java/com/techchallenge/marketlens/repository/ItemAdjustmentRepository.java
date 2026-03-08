package com.techchallenge.marketlens.repository;

import com.techchallenge.marketlens.domain.ItemAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemAdjustmentRepository extends JpaRepository<ItemAdjustment, Long> {
    // Busca o ajuste específico de um item (ex: saber se o "Shampoo" tem fator 0)
    Optional<ItemAdjustment> findByItemNameIgnoreCase(String itemName);
}