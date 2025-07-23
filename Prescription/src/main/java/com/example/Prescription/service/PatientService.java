package com.example.Prescription.service;

import com.example.Prescription.model.Patient;
import com.example.Prescription.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Save a new patient
    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Fetch all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}
