package com.techchallenge.marketlens.repository;

import com.techchallenge.marketlens.domain.FamilyProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FamilyProfileRepository extends JpaRepository<FamilyProfile, Long> {
    // Como assumimos 1 perfil por enquanto no MVP, podemos buscar o primeiro que existir
    FamilyProfile findFirstByOrderByIdAsc();
}