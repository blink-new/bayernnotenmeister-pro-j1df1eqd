import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Subject, GRADE_TYPES } from '../types';
import { calculateSubjectGrade, calculateOverallGPA, formatGrade } from './calculations';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: string[][];
      startY?: number;
      theme?: string;
      headStyles?: { fillColor: number[] };
      margin?: { left: number; right: number };
      styles?: { fontSize: number };
      columnStyles?: Record<number, { cellWidth: number | string; halign?: string }>;
    }) => jsPDF;
    lastAutoTable?: { finalY: number };
  }
}

export const exportToPDF = (subjects: Subject[], studentName?: string) => {
  try {
    console.log('Starting PDF export...');
    
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'Bayernnotenmeister Pro - Notenübersicht',
      subject: 'Notenübersicht',
      creator: 'Bayernnotenmeister Pro',
      keywords: 'Noten, Bayern, Schule, Zeugnis'
    });

    // Header
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Bayernnotenmeister Pro', 20, 25);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Notenübersicht', 20, 35);
    
    if (studentName) {
      doc.setFontSize(12);
      doc.text(`Schüler/in: ${studentName}`, 20, 45);
    }
    
    doc.setFontSize(10);
    doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 20, studentName ? 55 : 45);
    
    let yPosition = studentName ? 70 : 60;
    
    // Overall GPA
    const overallGPA = calculateOverallGPA(subjects);
    if (subjects.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Gesamtdurchschnitt:', 20, yPosition);
      doc.setFontSize(18);
      doc.setTextColor(...getGradeColorRGB(overallGPA));
      doc.text(formatGrade(overallGPA), 80, yPosition);
      doc.setTextColor(0, 0, 0);
      yPosition += 20;
    }
    
    // Subject breakdown
    const subjectsWithGrades = subjects.filter(s => s.grades.length > 0);
    
    if (subjectsWithGrades.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Fächer im Detail:', 20, yPosition);
      yPosition += 10;
      
      subjectsWithGrades.forEach((subject, index) => {
        const subjectGrade = calculateSubjectGrade(subject);
        
        // Subject header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${subject.name} ${subject.isMainSubject ? '(Hauptfach)' : '(Nebenfach)'}`, 20, yPosition);
        doc.setTextColor(...getGradeColorRGB(subjectGrade));
        doc.text(`Note: ${formatGrade(subjectGrade)}`, 150, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 5;
        
        // Grades table
        const gradeData = subject.grades.map(grade => [
          GRADE_TYPES[grade.type],
          grade.value.toString(),
          grade.weight.toString(),
          new Date(grade.date).toLocaleDateString('de-DE'),
          grade.description || '-'
        ]);
        
        doc.autoTable({
          head: [['Typ', 'Note', 'Gewicht', 'Datum', 'Beschreibung']],
          body: gradeData,
          startY: yPosition,
          theme: 'grid',
          headStyles: { fillColor: [59, 130, 246] },
          margin: { left: 20, right: 20 },
          styles: { fontSize: 8 },
          columnStyles: {
            0: { cellWidth: 30 },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 25 },
            4: { cellWidth: 'auto' }
          }
        });
        
        yPosition = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : yPosition + 30;
        
        // Add new page if needed
        if (yPosition > 250 && index < subjectsWithGrades.length - 1) {
          doc.addPage();
          yPosition = 20;
        }
      });
    }
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Seite ${i} von ${pageCount}`, 20, 285);
      doc.text('Erstellt mit Bayernnotenmeister Pro', 150, 285);
    }
    
    // Save the PDF
    const fileName = `Notenübersicht_${studentName || 'Schüler'}_${new Date().toISOString().split('T')[0]}.pdf`;
    console.log('Saving PDF as:', fileName);
    
    doc.save(fileName);
    console.log('PDF export completed successfully');
    
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('PDF-Export fehlgeschlagen: ' + (error instanceof Error ? error.message : 'Unbekannter Fehler'));
  }
};

const getGradeColorRGB = (grade: number): [number, number, number] => {
  if (grade <= 1.5) return [34, 197, 94];  // green
  if (grade <= 2.5) return [163, 230, 53]; // lime
  if (grade <= 3.5) return [234, 179, 8];  // yellow
  if (grade <= 4.5) return [249, 115, 22]; // orange
  if (grade <= 5.5) return [239, 68, 68];  // red
  return [153, 27, 27]; // dark red
};