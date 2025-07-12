import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { MAIN_SUBJECTS } from '../types';

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSubject: (name: string) => void;
}

export const AddSubjectDialog = ({ open, onOpenChange, onAddSubject }: AddSubjectDialogProps) => {
  const [subjectName, setSubjectName] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [selectedType, setSelectedType] = useState<'preset' | 'custom'>('preset');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = selectedType === 'preset' ? subjectName : customSubject;
    if (name.trim()) {
      onAddSubject(name.trim());
      setSubjectName('');
      setCustomSubject('');
      setSelectedType('preset');
      onOpenChange(false);
    }
  };

  const commonSubjects = [
    ...MAIN_SUBJECTS,
    'Physik',
    'Chemie',
    'Biologie',
    'Geschichte',
    'Sozialkunde',
    'Erdkunde',
    'Wirtschaft',
    'Religion',
    'Ethik',
    'Kunst',
    'Musik',
    'Sport',
    'Informatik'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl">Neues Fach hinzufügen</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
          <div className="space-y-3 lg:space-y-4">
            <div>
              <Label className="text-sm lg:text-base font-medium">Fach auswählen</Label>
              <p className="text-xs lg:text-sm text-gray-600 mb-3">
                Wähle aus den häufigsten Fächern oder erstelle ein eigenes
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                <Button
                  type="button"
                  variant={selectedType === 'preset' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('preset')}
                  className="justify-start text-sm h-9 lg:h-10"
                >
                  Aus Liste wählen
                </Button>
                <Button
                  type="button"
                  variant={selectedType === 'custom' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('custom')}
                  className="justify-start text-sm h-9 lg:h-10"
                >
                  Eigenes Fach
                </Button>
              </div>

              {selectedType === 'preset' ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {commonSubjects.map(subject => (
                      <Badge
                        key={subject}
                        variant={subjectName === subject ? 'default' : 'outline'}
                        className={`cursor-pointer text-xs lg:text-sm px-2 lg:px-3 py-1 lg:py-1.5 ${
                          MAIN_SUBJECTS.includes(subject) 
                            ? 'border-amber-300 hover:border-amber-400' 
                            : 'border-blue-300 hover:border-blue-400'
                        }`}
                        onClick={() => setSubjectName(subject)}
                      >
                        {subject}
                        {MAIN_SUBJECTS.includes(subject) && ' ⭐'}
                      </Badge>
                    ))}
                  </div>
                  {subjectName && (
                    <div className="p-3 bg-blue-50 rounded-lg border">
                      <p className="text-xs lg:text-sm">
                        <strong>Ausgewählt:</strong> {subjectName}
                        {MAIN_SUBJECTS.includes(subjectName) && (
                          <span className="ml-2 text-amber-600">(Hauptfach)</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Fachname eingeben..."
                    className="w-full text-sm lg:text-base h-9 lg:h-10"
                  />
                  {customSubject && (
                    <div className="p-3 bg-blue-50 rounded-lg border">
                      <p className="text-xs lg:text-sm">
                        <strong>Neues Fach:</strong> {customSubject}
                        <span className="ml-2 text-blue-600">(Nebenfach)</span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="submit" 
              className="flex-1 text-sm lg:text-base h-9 lg:h-10"
              disabled={selectedType === 'preset' ? !subjectName : !customSubject.trim()}
            >
              Fach hinzufügen
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