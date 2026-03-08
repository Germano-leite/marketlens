package com.techchallenge.marketlens.repository;

import com.techchallenge.marketlens.domain.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDateTime;


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

    // Busca Nomes Únicos (DISTINCT) unindo o Item com a Nota Fiscal (JOIN p.receipt)
    // Filtra pela data da nota fiscal e apenas pelas categorias essenciais que você quer.
    @Query("SELECT DISTINCT p.productName FROM ProductItem p JOIN p.receipt r " +
           "WHERE r.date >= :startDate " +
           "AND UPPER(p.category) IN ('MERCEARIA', 'LIMPEZA', 'HIGIENE', 'LATICINIOS')")
    List<String> findEssentialItemsSince(@Param("startDate") LocalDateTime startDate);

    // Busca a média de preço do histórico baseado em uma palavra-chave
    @Query("SELECT AVG(p.unitPrice) FROM ProductItem p WHERE UPPER(p.productName) LIKE UPPER(CONCAT('%', :keyword, '%'))")
    Double findAverageHistoricalPrice(@org.springframework.data.repository.query.Param("keyword") String keyword);
}