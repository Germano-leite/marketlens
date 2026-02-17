package com.techchallenge.marketlens.repository;

import com.techchallenge.marketlens.domain.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    
    // O Spring cria o SQL sozinho baseado no nome do método:
    // "Busque por Nome do Produto, Contendo o texto X, Ignorando Maiúsculas"
    List<ProductItem> findByProductNameContainingIgnoreCase(String name);

    // Busca items onde o NOME, a CATEGORIA ou a SUBCATEGORIA contenham o texto (ignora maiúsculas)
    @Query("SELECT p FROM ProductItem p WHERE " +
           "LOWER(p.productName) LIKE LOWER(CONCAT('%', :text, '%')) OR " +
           "LOWER(p.category) LIKE LOWER(CONCAT('%', :text, '%')) OR " +
           "LOWER(p.subCategory) LIKE LOWER(CONCAT('%', :text, '%'))")
    List<ProductItem> searchAny(@Param("text") String text);

    // Busca exata pela subcategoria 
    List<ProductItem> findBySubCategoryIgnoreCase(String subCategory);
}