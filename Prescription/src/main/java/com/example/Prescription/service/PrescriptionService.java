//package com.example.Prescription.service;
//
//import com.example.Prescription.PDFGenerator;
//import com.example.Prescription.model.Patient;
//import com.example.Prescription.model.Prescription;
//import com.example.Prescription.repository.PatientRepository;
//import com.example.Prescription.repository.PrescriptionRepository;
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//import org.springframework.core.io.ByteArrayResource;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//@Service
//public class PrescriptionService {
//
//    private final PrescriptionRepository prescriptionRepository;
//    private final PatientRepository patientRepository;
//    private final MailService mailService;
//
//    public PrescriptionService(PrescriptionRepository prescriptionRepository,
//                               PatientRepository patientRepository,
//                               MailService mailService) {
//        this.prescriptionRepository = prescriptionRepository;
//        this.patientRepository = patientRepository;
//        this.mailService = mailService;
//    }
//
//    public Prescription createPrescription(Long patientId, Prescription prescription) {
//        Patient patient = patientRepository.findById(patientId)
//                .orElseThrow(() -> new RuntimeException("Patient not found"));
//
//        prescription.setPatient(patient);
//        Prescription saved = prescriptionRepository.save(prescription);
//
//        // Generate PDF and send email
//        byte[] pdfBytes = PDFGenerator.generatePrescriptionPDF(saved);
//        mailService.sendEmailWithAttachment(patient.getEmail(), "Your Prescription", "Please find attached", pdfBytes);
//
//        return saved;
//    }
//    private void sendEmailWithAttachment(String toEmail, byte[] pdfBytes) {
//        try {
//            MimeMessage message = mailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//            helper.setTo(toEmail);
//            helper.setSubject("Your Prescription");
//            helper.setText("Please find your prescription attached.", true);
//
//            helper.addAttachment("prescription.pdf", new ByteArrayResource(pdfBytes));
//
//            mailSender.send(message);
//
//        } catch (MessagingException e) {
//            throw new RuntimeException("Failed to send email", e);
//        }
//    }
//
//}
//
package com.example.Prescription.service;

import com.example.Prescription.PDFGenerator;
import com.example.Prescription.model.Patient;
import com.example.Prescription.model.Prescription;
import com.example.Prescription.repository.PatientRepository;
import com.example.Prescription.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final MailService mailService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               PatientRepository patientRepository,
                               MailService mailService) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.mailService = mailService;
    }

    public Prescription createPrescription(Long patientId, Prescription prescription) {
        // Fetch patient
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Set patient to prescription
        prescription.setPatient(patient);

        // Save prescription to database
        Prescription savedPrescription = prescriptionRepository.save(prescription);

        // Generate PDF
        byte[] pdfBytes = PDFGenerator.generatePrescriptionPDF(savedPrescription);

        // Send email with PDF
        mailService.sendEmailWithAttachment(
                patient.getEmail(),
                "Your Prescription",
                "Please find your prescription attached.",
                pdfBytes
        );

        return savedPrescription;
    }
}
