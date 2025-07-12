import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Edit2, Trash2, TrendingUp, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface Goal {
  id: string;
  title: string;
  targetGrade: number;
  subject: string;
  currentGrade?: number;
  targetDate: string;
  achieved: boolean;
  createdAt: Date;
}

interface GoalTrackerProps {
  subjects: { id: string; name: string }[];
  grades: { value: string; subjectId: string; type: string }[];
}

export function GoalTracker({ subjects, grades }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetGrade: 2.0,
    subject: '',
    targetDate: ''
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('bayernnotenmeister-goals');
    if (savedGoals) {
      const parsed: (Goal & { createdAt: string })[] = JSON.parse(savedGoals);
      setGoals(parsed.map((g) => ({
        ...g,
        createdAt: new Date(g.createdAt)
      })));
    }
  }, []);

  // Save goals to localStorage
  useEffect(() => {
    localStorage.setItem('bayernnotenmeister-goals', JSON.stringify(goals));
  }, [goals]);

  // Calculate current grade for each subject
  const getCurrentGrade = (subjectId: string) => {
    const subjectGrades = grades.filter(g => g.subjectId === subjectId);
    if (subjectGrades.length === 0) return null;
    
    const average = subjectGrades.reduce((sum, grade) => sum + parseFloat(grade.value), 0) / subjectGrades.length;
    return Math.round(average * 10) / 10;
  };

  // Update goals with current grades and achievement status
  useEffect(() => {
    setGoals(prevGoals => 
      prevGoals.map(goal => {
        const currentGrade = getCurrentGrade(goal.subject);
        const achieved = currentGrade !== null && currentGrade <= goal.targetGrade;
        
        return {
          ...goal,
          currentGrade,
          achieved
        };
      })
    );
  }, [grades]);

  const handleSaveGoal = () => {
    if (!newGoal.title || !newGoal.subject || !newGoal.targetDate) return;

    const goal: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      title: newGoal.title,
      targetGrade: newGoal.targetGrade,
      subject: newGoal.subject,
      targetDate: newGoal.targetDate,
      achieved: false,
      createdAt: editingGoal?.createdAt || new Date()
    };

    if (editingGoal) {
      setGoals(prev => prev.map(g => g.id === editingGoal.id ? goal : g));
    } else {
      setGoals(prev => [...prev, goal]);
    }

    // Reset form
    setNewGoal({ title: '', targetGrade: 2.0, subject: '', targetDate: '' });
    setEditingGoal(null);
    setIsDialogOpen(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      targetGrade: goal.targetGrade,
      subject: goal.subject,
      targetDate: goal.targetDate
    });
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  };

  const getProgressPercentage = (goal: Goal) => {
    if (!goal.currentGrade) return 0;
    
    // For grades, lower is better, so we need to inverse the calculation
    const worstGrade = 6.0;
    const progress = ((worstGrade - goal.currentGrade) / (worstGrade - goal.targetGrade)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const getDaysLeft = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || 'Unbekanntes Fach';
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Ziel-Tracker
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                onClick={() => {
                  setEditingGoal(null);
                  setNewGoal({ title: '', targetGrade: 2.0, subject: '', targetDate: '' });
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Ziel hinzufügen
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? 'Ziel bearbeiten' : 'Neues Ziel erstellen'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Ziel-Titel</label>
                  <Input
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="z.B. Bessere Note in Mathe"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Fach</label>
                  <Select value={newGoal.subject} onValueChange={(value) => setNewGoal(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fach auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Ziel-Note</label>
                  <Select value={newGoal.targetGrade.toString()} onValueChange={(value) => setNewGoal(prev => ({ ...prev, targetGrade: parseFloat(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.0">1.0 (Sehr gut)</SelectItem>
                      <SelectItem value="1.5">1.5</SelectItem>
                      <SelectItem value="2.0">2.0 (Gut)</SelectItem>
                      <SelectItem value="2.5">2.5</SelectItem>
                      <SelectItem value="3.0">3.0 (Befriedigend)</SelectItem>
                      <SelectItem value="3.5">3.5</SelectItem>
                      <SelectItem value="4.0">4.0 (Ausreichend)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Ziel-Datum</label>
                  <Input
                    type="date"
                    value={newGoal.targetDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  />
                </div>
                
                <Button onClick={handleSaveGoal} className="w-full">
                  {editingGoal ? 'Ziel aktualisieren' : 'Ziel erstellen'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Noch keine Ziele gesetzt</p>
            <p className="text-sm">Erstelle dein erstes Lernziel!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const daysLeft = getDaysLeft(goal.targetDate);
              const progress = getProgressPercentage(goal);
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    goal.achieved 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900">{goal.title}</h4>
                        {goal.achieved && (
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Erreicht!
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Fach: {getSubjectName(goal.subject)}</p>
                        <p>Ziel: Note {goal.targetGrade}</p>
                        {goal.currentGrade && (
                          <p>Aktuell: Note {goal.currentGrade}</p>
                        )}
                        <p className={`${daysLeft < 0 ? 'text-red-500' : daysLeft < 7 ? 'text-orange-500' : 'text-gray-600'}`}>
                          {daysLeft < 0 ? `${Math.abs(daysLeft)} Tage überfällig` : 
                           daysLeft === 0 ? 'Heute fällig' :
                           `${daysLeft} Tage verbleibend`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {goal.currentGrade && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Fortschritt</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  )}
                  
                  {!goal.currentGrade && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded">
                      <TrendingUp className="w-4 h-4" />
                      Trage Noten ein, um den Fortschritt zu sehen
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}