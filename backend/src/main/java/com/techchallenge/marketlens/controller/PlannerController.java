package com.techchallenge.marketlens.controller;

import com.techchallenge.marketlens.domain.ItemAdjustment;
import com.techchallenge.marketlens.dto.PlannerSummaryDTO;
import com.techchallenge.marketlens.repository.ItemAdjustmentRepository;
import com.techchallenge.marketlens.service.PlannerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/planner")
@CrossOrigin(origins = "*") // Essencial: Permite que o frontend (React) converse com o backend sem erro de CORS
public class PlannerController {

    private final PlannerService plannerService;
    private final ItemAdjustmentRepository adjustmentRepository;

    // Injeção de dependências
    public PlannerController(PlannerService plannerService, ItemAdjustmentRepository adjustmentRepository) {
        this.plannerService = plannerService;
        this.adjustmentRepository = adjustmentRepository;
    }

    // ==========================================
    // ENDPOINT 1: GERAR A LISTA (O React chama este)
    // ==========================================
    @GetMapping("/generate")
    public ResponseEntity<PlannerSummaryDTO> generatePlan() {
        PlannerSummaryDTO plan = plannerService.generateMonthlyPlan();
        return ResponseEntity.ok(plan);
    }

// ==========================================
    // ENDPOINT 2: SALVAR O FEEDBACK
    // ==========================================
    @PostMapping("/feedback")
    public ResponseEntity<Void> saveFeedback(@RequestParam String itemName, @RequestParam Double factor) {
        
        Optional<ItemAdjustment> existingAdjustment = adjustmentRepository.findByItemNameIgnoreCase(itemName);
        ItemAdjustment adjustment;
        
        if (existingAdjustment.isPresent()) {
            adjustment = existingAdjustment.get();
            
            // Fator 0.0 recebido do React significa Botão Lixeira
            if (factor == 0.0) {
                adjustment.setAdjustmentFactor(-999.0); // Usamos -999.0 como uma Flag de Exclusão
            } 
            // Fator > 1.0 recebido do React significa Botão ➕
            else if (factor > 1.0) {
                double currentDelta = adjustment.getAdjustmentFactor();
                if (currentDelta == -999.0) currentDelta = 0.0; // Recupera da lixeira se ele se arrepender
                adjustment.setAdjustmentFactor(currentDelta + 1.0); // Adiciona +1 item
            } 
            // Fator < 1.0 recebido do React significa Botão ➖
            else if (factor < 1.0) {
                double currentDelta = adjustment.getAdjustmentFactor();
                adjustment.setAdjustmentFactor(currentDelta - 1.0); // Remove -1 item
            }
            
        } else {
            // Se é o primeiro clique da família neste item
            double initialDelta = 0.0;
            if (factor == 0.0) initialDelta = -999.0;
            else if (factor > 1.0) initialDelta = 1.0;
            else if (factor < 1.0) initialDelta = -1.0;
            
            adjustment = new ItemAdjustment(itemName, initialDelta);
        }
        
        adjustmentRepository.save(adjustment);
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // ENDPOINT 3: SALVAR O PERFIL DA FAMÍLIA
    // ==========================================
    @PostMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestBody com.techchallenge.marketlens.dto.FamilyProfileDTO profileDTO) {
        plannerService.saveProfile(profileDTO);
        return ResponseEntity.ok().build();
    }
}