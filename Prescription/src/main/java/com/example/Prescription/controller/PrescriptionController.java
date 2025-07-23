package com.example.Prescription.controller;
import com.example.Prescription.model.Prescription;
import com.example.Prescription.service.PrescriptionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/patient/{patientId}")
    public ResponseEntity<Prescription> createPrescription(@PathVariable Long patientId,
                                                           @RequestBody Prescription prescription) {
        Prescription saved = prescriptionService.createPrescription(patientId, prescription);
        return ResponseEntity.ok(saved);
    }
}

