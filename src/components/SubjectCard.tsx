import { Plus, Trash2, Star, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Subject, GRADE_TYPES } from '../types';
import { calculateSubjectGrade, formatGrade, getGradeColor, getGradeBackground } from '../utils/calculations';

interface SubjectCardProps {
  subject: Subject;
  onAddGrade: (subject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
  onDeleteGrade: (subjectId: string, gradeId: string) => void;
}

export const SubjectCard = ({ subject, onAddGrade, onDeleteSubject, onDeleteGrade }: SubjectCardProps) => {
  const finalGrade = calculateSubjectGrade(subject);
  const hasGrades = subject.grades.length > 0;

  return (
    <Card className={`${hasGrades ? getGradeBackground(finalGrade) : ''} border-2 hover:shadow-lg transition-shadow`}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center ${
              subject.isMainSubject 
                ? 'bg-gradient-to-br from-amber-400 to-orange-500' 
                : 'bg-gradient-to-br from-blue-400 to-purple-500'
            }`}>
              {subject.isMainSubject ? (
                <Star className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              ) : (
                <span className="text-white font-bold text-sm lg:text-base">{subject.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg lg:text-xl">{subject.name}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <Badge variant={subject.isMainSubject ? "default" : "secondary"} className="text-xs">
                  {subject.isMainSubject ? "Hauptfach" : "Nebenfach"}
                </Badge>
                <span className="text-xs lg:text-sm text-gray-500">
                  {subject.grades.length} {subject.grades.length === 1 ? 'Note' : 'Noten'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {hasGrades && (
              <div className={`text-2xl lg:text-3xl font-bold ${getGradeColor(finalGrade)} mr-2`}>
                {formatGrade(finalGrade)}
              </div>
            )}
            <div className="flex gap-2 flex-1 sm:flex-none">
              <Button
                onClick={() => onAddGrade(subject)}
                size="sm"
                className="gap-2 flex-1 sm:flex-none text-xs lg:text-sm"
              >
                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="hidden sm:inline">Note</span>
                <span className="sm:hidden">+</span>
              </Button>
              <Button
                onClick={() => onDeleteSubject(subject.id)}
                size="sm"
                variant="destructive"
                className="px-2 lg:px-3"
              >
                <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {hasGrades ? (
          <div className="space-y-3">
            {subject.grades.map((grade) => (
              <div
                key={grade.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 lg:p-4 bg-white/50 rounded-lg border gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center font-bold text-sm lg:text-base ${getGradeColor(grade.value)} bg-white`}>
                    {grade.value}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm lg:text-base">{GRADE_TYPES[grade.type]}</span>
                      <Badge variant="outline" className="text-xs">
                        Gewicht: {grade.weight}
                      </Badge>
                    </div>
                    {grade.description && (
                      <p className="text-xs lg:text-sm text-gray-600 mt-1">{grade.description}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(grade.date).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onDeleteGrade(subject.id, grade.id)}
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 lg:py-12 text-gray-500">
            <Calendar className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm lg:text-base">Noch keine Noten eingetragen</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};