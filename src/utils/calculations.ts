import { Grade, Subject } from '../types';

export const calculateWeightedAverage = (grades: Grade[]): number => {
  if (grades.length === 0) return 0;
  
  const totalWeight = grades.reduce((sum, grade) => sum + grade.weight, 0);
  const weightedSum = grades.reduce((sum, grade) => sum + (grade.value * grade.weight), 0);
  
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

export const calculateSubjectGrade = (subject: Subject): number => {
  const { grades, isMainSubject } = subject;
  
  if (grades.length === 0) return 0;
  
  if (isMainSubject) {
    // Main subjects: (SA average * 2 + average of all other grades) / 3
    const saGrades = grades.filter(g => g.type === 'SA');
    const otherGrades = grades.filter(g => g.type !== 'SA');
    
    if (saGrades.length === 0) {
      return calculateWeightedAverage(otherGrades);
    }
    
    const saAverage = calculateWeightedAverage(saGrades);
    const otherAverage = otherGrades.length > 0 ? calculateWeightedAverage(otherGrades) : saAverage;
    
    return (saAverage * 2 + otherAverage) / 3;
  } else {
    // Minor subjects: (SA average + average of all other grades) / 2
    const saGrades = grades.filter(g => g.type === 'SA');
    const otherGrades = grades.filter(g => g.type !== 'SA');
    
    // If no SA grades, use average of all grades
    if (saGrades.length === 0) {
      return calculateWeightedAverage(otherGrades);
    }
    
    // If no other grades, use SA average
    if (otherGrades.length === 0) {
      return calculateWeightedAverage(saGrades);
    }
    
    const saAverage = calculateWeightedAverage(saGrades);
    const otherAverage = calculateWeightedAverage(otherGrades);
    
    return (saAverage + otherAverage) / 2;
  }
};

export const calculateOverallGPA = (subjects: Subject[]): number => {
  const subjectsWithGrades = subjects.filter(s => s.grades.length > 0);
  
  if (subjectsWithGrades.length === 0) return 0;
  
  const totalGrade = subjectsWithGrades.reduce((sum, subject) => {
    return sum + calculateSubjectGrade(subject);
  }, 0);
  
  return totalGrade / subjectsWithGrades.length;
};

export const formatGrade = (grade: number): string => {
  return grade.toFixed(2);
};

export const getGradeColor = (grade: number): string => {
  if (grade <= 1.5) return 'text-green-600';
  if (grade <= 2.5) return 'text-lime-600';
  if (grade <= 3.5) return 'text-yellow-600';
  if (grade <= 4.5) return 'text-orange-600';
  if (grade <= 5.5) return 'text-red-600';
  return 'text-red-800';
};

export const getGradeBackground = (grade: number): string => {
  if (grade <= 1.5) return 'bg-green-50 border-green-200';
  if (grade <= 2.5) return 'bg-lime-50 border-lime-200';
  if (grade <= 3.5) return 'bg-yellow-50 border-yellow-200';
  if (grade <= 4.5) return 'bg-orange-50 border-orange-200';
  if (grade <= 5.5) return 'bg-red-50 border-red-200';
  return 'bg-red-100 border-red-300';
};