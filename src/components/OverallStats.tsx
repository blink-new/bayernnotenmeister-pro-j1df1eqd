import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, Star, BookOpen, Target } from 'lucide-react';
import { Subject } from '../types';
import { calculateSubjectGrade, calculateOverallGPA, formatGrade, getGradeColor } from '../utils/calculations';

interface OverallStatsProps {
  subjects: Subject[];
}

export const OverallStats = ({ subjects }: OverallStatsProps) => {
  const subjectsWithGrades = subjects.filter(s => s.grades.length > 0);
  const overallGPA = calculateOverallGPA(subjects);
  
  const mainSubjects = subjects.filter(s => s.isMainSubject && s.grades.length > 0);
  const otherSubjects = subjects.filter(s => !s.isMainSubject && s.grades.length > 0);
  
  const mainSubjectsGPA = mainSubjects.length > 0 
    ? mainSubjects.reduce((sum, s) => sum + calculateSubjectGrade(s), 0) / mainSubjects.length 
    : 0;
  
  const otherSubjectsGPA = otherSubjects.length > 0 
    ? otherSubjects.reduce((sum, s) => sum + calculateSubjectGrade(s), 0) / otherSubjects.length 
    : 0;

  const bestSubject = subjectsWithGrades.reduce((best, subject) => {
    const grade = calculateSubjectGrade(subject);
    const bestGrade = calculateSubjectGrade(best);
    return grade < bestGrade ? subject : best;
  }, subjectsWithGrades[0]);

  const worstSubject = subjectsWithGrades.reduce((worst, subject) => {
    const grade = calculateSubjectGrade(subject);
    const worstGrade = calculateSubjectGrade(worst);
    return grade > worstGrade ? subject : worst;
  }, subjectsWithGrades[0]);

  const totalGrades = subjects.reduce((sum, subject) => sum + subject.grades.length, 0);

  if (subjectsWithGrades.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Statistiken verfügbar</h3>
        <p className="text-gray-600">Füge Noten hinzu, um deine Statistiken zu sehen</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Gesamtdurchschnitt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getGradeColor(overallGPA)}`}>
                {formatGrade(overallGPA)}
              </div>
              <Target className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Hauptfächer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getGradeColor(mainSubjectsGPA)}`}>
                {mainSubjects.length > 0 ? formatGrade(mainSubjectsGPA) : '--'}
              </div>
              <Star className="w-8 h-8 text-amber-400" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {mainSubjects.length} von {mainSubjects.length + otherSubjects.length} Fächern
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Nebenfächer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${getGradeColor(otherSubjectsGPA)}`}>
                {otherSubjects.length > 0 ? formatGrade(otherSubjectsGPA) : '--'}
              </div>
              <BookOpen className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {otherSubjects.length} von {mainSubjects.length + otherSubjects.length} Fächern
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Best/Worst Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bestSubject && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Bestes Fach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-900">{bestSubject.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {bestSubject.isMainSubject ? 'Hauptfach' : 'Nebenfach'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatGrade(calculateSubjectGrade(bestSubject))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {worstSubject && bestSubject !== worstSubject && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Verbesserungspotential
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-900">{worstSubject.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {worstSubject.isMainSubject ? 'Hauptfach' : 'Nebenfach'}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {formatGrade(calculateSubjectGrade(worstSubject))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detailed Subject List */}
      <Card>
        <CardHeader>
          <CardTitle>Detaillierte Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {subjectsWithGrades
              .sort((a, b) => calculateSubjectGrade(a) - calculateSubjectGrade(b))
              .map((subject) => {
                const grade = calculateSubjectGrade(subject);
                return (
                  <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        subject.isMainSubject 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {subject.isMainSubject ? '★' : subject.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{subject.name}</h4>
                        <p className="text-sm text-gray-600">
                          {subject.grades.length} {subject.grades.length === 1 ? 'Note' : 'Noten'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={subject.isMainSubject ? "default" : "secondary"}>
                        {subject.isMainSubject ? 'Hauptfach' : 'Nebenfach'}
                      </Badge>
                      <div className={`text-xl font-bold ${getGradeColor(grade)}`}>
                        {formatGrade(grade)}
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Gesamt:</strong> {totalGrades} Noten in {subjectsWithGrades.length} Fächern
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};