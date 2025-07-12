import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Subject, Grade, GRADE_TYPES, BAVARIAN_GRADES } from '../types';

interface AddGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: Subject | null;
  onAddGrade: (subjectId: string, grade: Omit<Grade, 'id'>) => void;
}

export const AddGradeDialog = ({ open, onOpenChange, subject, onAddGrade }: AddGradeDialogProps) => {
  const [gradeType, setGradeType] = useState<keyof typeof GRADE_TYPES>('Ex');
  const [gradeValue, setGradeValue] = useState<number>(1);
  const [weight, setWeight] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject) {
      onAddGrade(subject.id, {
        type: gradeType,
        value: gradeValue,
        weight,
        description: description.trim(),
        date: new Date(date),
      });
      // Reset form
      setGradeType('Ex');
      setGradeValue(1);
      setWeight(1);
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      onOpenChange(false);
    }
  };

  const getGradeColor = (grade: number): string => {
    if (grade <= 1.5) return 'text-green-600 bg-green-50';
    if (grade <= 2.5) return 'text-lime-600 bg-lime-50';
    if (grade <= 3.5) return 'text-yellow-600 bg-yellow-50';
    if (grade <= 4.5) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (!subject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl">Note hinzufügen - {subject.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="gradeType" className="text-sm lg:text-base">Notentyp</Label>
              <Select value={gradeType} onValueChange={(value) => setGradeType(value as keyof typeof GRADE_TYPES)}>
                <SelectTrigger className="h-9 lg:h-10 text-sm lg:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(GRADE_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value} ({key})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gradeValue" className="text-sm lg:text-base">Note</Label>
              <Select value={gradeValue.toString()} onValueChange={(value) => setGradeValue(Number(value))}>
                <SelectTrigger className="h-9 lg:h-10 text-sm lg:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BAVARIAN_GRADES.map(grade => (
                    <SelectItem key={grade} value={grade.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{grade}</span>
                        <Badge variant="outline" className={`ml-2 text-xs ${getGradeColor(grade)}`}>
                          {grade === 1 ? 'Sehr gut' : 
                           grade === 2 ? 'Gut' : 
                           grade === 3 ? 'Befriedigend' : 
                           grade === 4 ? 'Ausreichend' : 
                           grade === 5 ? 'Mangelhaft' : 'Ungenügend'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm lg:text-base">Gewichtung</Label>
              <Input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full h-9 lg:h-10 text-sm lg:text-base"
              />
              <p className="text-xs text-gray-500">
                Höhere Werte = stärkere Gewichtung
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm lg:text-base">Datum</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 lg:h-10 text-sm lg:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm lg:text-base">Beschreibung (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="z.B. Klassenarbeit über Kapitel 3, Vokabeltest..."
              className="w-full text-sm lg:text-base"
              rows={3}
            />
          </div>

          {/* Formula explanation */}
          <div className="p-3 lg:p-4 bg-blue-50 rounded-lg border">
            <h4 className="font-medium text-blue-900 mb-2 text-sm lg:text-base">
              Berechnungsformel für {subject.name}:
            </h4>
            <p className="text-xs lg:text-sm text-blue-800">
              {subject.isMainSubject 
                ? "Hauptfach: (SA-Durchschnitt × 2 + Durchschnitt aller anderen Noten) ÷ 3"
                : "Nebenfach: Durchschnitt aller Noten"
              }
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="flex-1 text-sm lg:text-base h-9 lg:h-10">
              Note hinzufügen
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="text-sm lg:text-base h-9 lg:h-10"
            >
              Abbrechen
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};