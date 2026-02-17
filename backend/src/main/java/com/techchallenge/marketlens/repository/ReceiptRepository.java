package com.techchallenge.marketlens.repository;

import com.techchallenge.marketlens.domain.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {
    // Aqui herdamos métodos prontos: save(), findAll(), findById(), delete()...
    // Não precisa escrever SQL nenhum!
}