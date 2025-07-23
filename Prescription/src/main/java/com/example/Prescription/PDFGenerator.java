//package com.example.Prescription;
//
//import com.example.Prescription.model.Prescription;
//import com.itextpdf.text.Document;
//import com.itextpdf.text.Paragraph;
//import com.itextpdf.text.pdf.PdfWriter;
//import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;
//
//public class PDFGenerator {
//
//    public static byte[] generatePrescriptionPDF(Prescription prescription) {
//        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
//            Document document = new Document();
//            PdfWriter.getInstance(document, out);
//            document.open();
//
//            document.add(new Paragraph("Prescription"));
//            document.add(new Paragraph("Patient: " + prescription.getPatient().getName()));
//            document.add(new Paragraph("Age: " + prescription.getPatient().getAge()));
//            document.add(new Paragraph("Gender: " + prescription.getPatient().getGender()));
//            document.add(new Paragraph("Diagnosis: " + prescription.getDiagnosis()));
//            document.add(new Paragraph("Medicine: " + prescription.getMedicine()));
//            document.add(new Paragraph("Dosage: " + prescription.getDosage()));
//            document.add(new Paragraph("Frequency: " + prescription.getFrequency()));
//
//            document.close();
//            return out.toByteArray();
//        } catch (Exception e) {
//            throw new RuntimeException("PDF creation failed", e);
//        }
//    }
//}
package com.example.Prescription;

import com.example.Prescription.model.Prescription;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.apache.tomcat.util.http.fileupload.ByteArrayOutputStream;

public class PDFGenerator {

    public static byte[] generatePrescriptionPDF(Prescription prescription) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            // Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BaseColor.BLACK);
            Paragraph title = new Paragraph("Medical Prescription", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            // Patient Details
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            Font valueFont = FontFactory.getFont(FontFactory.HELVETICA, 12);

            PdfPTable patientTable = new PdfPTable(2);
            patientTable.setWidthPercentage(100);
            patientTable.setSpacingAfter(15f);

            patientTable.addCell(getCell("Patient Name:", labelFont));
            patientTable.addCell(getCell(prescription.getPatient().getName(), valueFont));
            patientTable.addCell(getCell("Age:", labelFont));
            patientTable.addCell(getCell(String.valueOf(prescription.getPatient().getAge()), valueFont));
            patientTable.addCell(getCell("Gender:", labelFont));
            patientTable.addCell(getCell(prescription.getPatient().getGender(), valueFont));
            patientTable.addCell(getCell("Diagnosis:", labelFont));
            patientTable.addCell(getCell(prescription.getDiagnosis(), valueFont));

            document.add(patientTable);

            // Prescription Details Table
            Paragraph sectionHeader = new Paragraph("Prescription Details", labelFont);
            sectionHeader.setSpacingAfter(10f);
            document.add(sectionHeader);

            PdfPTable medicineTable = new PdfPTable(3); // Medicine, Dosage, Frequency
            medicineTable.setWidthPercentage(100);

            medicineTable.addCell(getCell("Medicine", labelFont));
            medicineTable.addCell(getCell("Dosage", labelFont));
            medicineTable.addCell(getCell("Frequency", labelFont));

            medicineTable.addCell(getCell(prescription.getMedicine(), valueFont));
            medicineTable.addCell(getCell(prescription.getDosage(), valueFont));
            medicineTable.addCell(getCell(prescription.getFrequency(), valueFont));

            document.add(medicineTable);

            // Footer
            Paragraph footer = new Paragraph("Note: Please follow the prescribed dosage as advised by the doctor.", valueFont);
            footer.setSpacingBefore(30f);
            document.add(footer);

            document.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("PDF creation failed", e);
        }
    }

    private static PdfPCell getCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(8f);
        cell.setBorder(Rectangle.BOX);
        return cell;
    }
}
