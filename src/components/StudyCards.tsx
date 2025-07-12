import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Subject } from '../types';
import { calculateSubjectGrade, formatGrade } from '../utils/calculations';
import { Brain, Star, Target, Trophy, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyCardsProps {
  subjects: Subject[];
}

interface StudyTip {
  type: 'improvement' | 'maintenance' | 'warning';
  subject: string;
  message: string;
  icon: React.ReactNode;
}

export const StudyCards = ({ subjects }: StudyCardsProps) => {
  const [currentTip, setCurrentTip] = useState(0);
  
  const generateStudyTips = (): StudyTip[] => {
    const tips: StudyTip[] = [];
    
    subjects.forEach(subject => {
      const grade = calculateSubjectGrade(subject);
      
      if (grade > 4.0) {
        tips.push({
          type: 'warning',
          subject: subject.name,
          message: `${subject.name}: Dringend verbessern! Aktuell ${formatGrade(grade)}`,
          icon: <AlertCircle className="w-5 h-5" />
        });
      } else if (grade > 3.0) {
        tips.push({
          type: 'improvement',
          subject: subject.name,
          message: `${subject.name}: Noch etwas Luft nach oben! Ziel: unter 3.0`,
          icon: <Target className="w-5 h-5" />
        });
      } else if (grade <= 2.0) {
        tips.push({
          type: 'maintenance',
          subject: subject.name,
          message: `${subject.name}: Sehr gut! Niveau halten mit ${formatGrade(grade)}`,
          icon: <Trophy className="w-5 h-5" />
        });
      }
    });
    
    return tips;
  };

  const studyTips = generateStudyTips();
  
  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % studyTips.length);
  };

  const getCardColor = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-red-50 border-red-200';
      case 'improvement': return 'bg-yellow-50 border-yellow-200';
      case 'maintenance': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getIconColor = (type: string) => {
    switch(type) {
      case 'warning': return 'text-red-500';
      case 'improvement': return 'text-yellow-500';
      case 'maintenance': return 'text-green-500';
      default: return 'text-blue-500';
    }
  };

  const calculateProgress = (subject: Subject) => {
    const grade = calculateSubjectGrade(subject);
    const progress = Math.max(0, Math.min(100, (5 - grade) * 25));
    return progress;
  };

  const getMotivationalMessage = (subjects: Subject[]) => {
    const goodSubjects = subjects.filter(s => calculateSubjectGrade(s) <= 2.5).length;
    const totalSubjects = subjects.length;
    const percentage = (goodSubjects / totalSubjects) * 100;
    
    if (percentage >= 80) return "🔥 Du bist ein Überflieger! Weiter so!";
    if (percentage >= 60) return "💪 Sehr gut! Du bist auf dem richtigen Weg!";
    if (percentage >= 40) return "📚 Gut gemacht! Noch ein bisschen mehr!";
    return "🎯 Nicht aufgeben! Jeder Schritt zählt!";
  };

  return (
    <div className="space-y-6">
      {/* Motivational Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Lerncoach</h2>
          </div>
          <p className="text-lg opacity-90">
            {getMotivationalMessage(subjects)}
          </p>
        </CardContent>
      </Card>

      {/* Study Tips Carousel */}
      {studyTips.length > 0 && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Persönliche Lerntipps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg ${getCardColor(studyTips[currentTip].type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={getIconColor(studyTips[currentTip].type)}>
                    {studyTips[currentTip].icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {studyTips[currentTip].message}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {studyTips[currentTip].subject}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                {studyTips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTip ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <Button onClick={nextTip} variant="outline" size="sm">
                Nächster Tipp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subject Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Lernfortschritt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjects.filter(s => s.grades.length > 0).map(subject => (
            <div key={subject.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{subject.name}</span>
                  <Badge variant={subject.isMainSubject ? "default" : "secondary"}>
                    {subject.isMainSubject ? "Hauptfach" : "Nebenfach"}
                  </Badge>
                </div>
                <span className="font-bold text-lg">
                  {formatGrade(calculateSubjectGrade(subject))}
                </span>
              </div>
              <Progress 
                value={calculateProgress(subject)} 
                className="h-2"
              />
              <p className="text-sm text-gray-600">
                {calculateProgress(subject).toFixed(0)}% zum Ziel
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievement System */}
      <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Erfolge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {subjects.filter(s => calculateSubjectGrade(s) <= 2.0).length}
              </div>
              <div className="text-sm opacity-90">Sehr gute Noten</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {subjects.reduce((sum, s) => sum + s.grades.length, 0)}
              </div>
              <div className="text-sm opacity-90">Eingetragene Noten</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};