export interface Grade {
  id: string;
  type: 'SA' | 'Ex' | 'MÜ' | 'M' | 'E';
  value: number;
  weight: number;
  description?: string;
  date: Date;
}

export interface Subject {
  id: string;
  name: string;
  isMainSubject: boolean;
  grades: Grade[];
  finalGrade?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}

export const MAIN_SUBJECTS = [
  'Deutsch',
  'Mathematik', 
  'Englisch',
  'Französisch',
  'Latein'
];

export const GRADE_TYPES = {
  SA: 'Schulaufgaben',
  Ex: 'Extemporale',
  MÜ: 'Mündlich',
  M: 'Mitarbeit',
  E: 'Ergebnisse'
} as const;

export const BAVARIAN_GRADES = [1, 2, 3, 4, 5, 6];