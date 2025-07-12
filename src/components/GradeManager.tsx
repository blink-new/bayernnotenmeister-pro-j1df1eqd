import { useState, useEffect } from 'react';
import { Plus, Download, BookOpen, TrendingUp, Brain, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Subject, Grade, MAIN_SUBJECTS } from '../types';
import { calculateOverallGPA, formatGrade, getGradeColor, getGradeBackground } from '../utils/calculations';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { SubjectCard } from './SubjectCard';
import { AddSubjectDialog } from './AddSubjectDialog';
import { AddGradeDialog } from './AddGradeDialog';
import { OverallStats } from './OverallStats';
import { ExportDialog } from './ExportDialog';
import { StudyCards } from './StudyCards';
import { GradeTrendChart } from './GradeTrendChart';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { AchievementSystem } from './AchievementSystem';
import { GoalTracker } from './GoalTracker';
import { MotivationalQuotes } from './MotivationalQuotes';
import { toast } from 'react-hot-toast';
import { generateCryptoUUID } from '../utils/uuid';

const themes = [
  {
    id: 'default',
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
    accent: 'linear-gradient(135deg, #2563eb, #9333ea)'
  },
  {
    id: 'ocean',
    gradient: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 50%, #e0f2fe 100%)',
    accent: 'linear-gradient(135deg, #0891b2, #2563eb)'
  },
  {
    id: 'forest',
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
    accent: 'linear-gradient(135deg, #059669, #10b981)'
  },
  {
    id: 'sunset',
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 50%, #fdf2f8 100%)',
    accent: 'linear-gradient(135deg, #ea580c, #dc2626)'
  },
  {
    id: 'galaxy',
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fdf2f8 100%)',
    accent: 'linear-gradient(135deg, #9333ea, #ec4899)'
  },
  {
    id: 'bavarian',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #dbeafe 100%)',
    accent: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)'
  },
  {
    id: 'academic',
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f4f4f5 100%)',
    accent: 'linear-gradient(135deg, #334155, #374151)'
  },
  {
    id: 'dark',
    gradient: 'linear-gradient(135deg, #111827 0%, #1e293b 50%, #111827 100%)',
    accent: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
  }
];

export const GradeManager = () => {
  const { user, syncSubjects, loadSubjects } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load and apply saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    const theme = themes.find(t => t.id === savedTheme);
    
    if (theme) {
      document.documentElement.style.setProperty('--theme-background', theme.gradient);
      document.documentElement.style.setProperty('--theme-accent', theme.accent);
    }
  }, []);

  // Load data when user logs in
  useEffect(() => {
    const loadUserData = async () => {
      if (user && !dataLoaded) {
        try {
          const cloudSubjects = await loadSubjects();
          if (cloudSubjects.length > 0) {
            setSubjects(cloudSubjects);
            toast.success('Daten aus der Cloud geladen!');
          }
        } catch (error) {
          console.error('Error loading subjects:', error);
          // Don't show error toast for auth errors - user might just not have data yet
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          if (!errorMessage.includes('401') && !errorMessage.includes('403')) {
            toast.error('Fehler beim Laden der Cloud-Daten');
          }
        } finally {
          setDataLoaded(true);
        }
      }
    };
    
    loadUserData();
  }, [user, dataLoaded, loadSubjects]);

  // Auto-sync when subjects change and user is logged in
  useEffect(() => {
    const autoSync = async () => {
      if (user && dataLoaded && subjects.length > 0) {
        try {
          await syncSubjects(subjects);
        } catch (error) {
          console.error('Auto-sync error:', error);
          // Silent fail for auto-sync to avoid annoying users
        }
      }
    };
    
    const timeoutId = setTimeout(autoSync, 2000); // Debounce auto-sync
    return () => clearTimeout(timeoutId);
  }, [subjects, user, dataLoaded, syncSubjects]);

  const handleManualSync = async () => {
    if (!user) {
      toast.error('Bitte melde dich an, um zu synchronisieren');
      return;
    }
    
    setSyncLoading(true);
    try {
      await syncSubjects(subjects);
      toast.success('Erfolgreich synchronisiert!');
    } catch (error) {
      console.error('Sync error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('403')) {
        toast.error('Zugriff verweigert. Bitte melde dich erneut an.');
      } else {
        toast.error('Synchronisierung fehlgeschlagen');
      }
    } finally {
      setSyncLoading(false);
    }
  };

  const addSubject = (name: string) => {
    const newSubject: Subject = {
      id: generateCryptoUUID(),
      name,
      isMainSubject: MAIN_SUBJECTS.includes(name),
      grades: [],
    };
    setSubjects([...subjects, newSubject]);
    toast.success(`✨ Fach "${name}" hinzugefügt!`);
  };

  const addGrade = (subjectId: string, grade: Omit<Grade, 'id'>) => {
    const newGrade: Grade = {
      ...grade,
      id: generateCryptoUUID(),
    };
    
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, grades: [...subject.grades, newGrade] }
        : subject
    ));
    toast.success(`📝 Note ${grade.value} hinzugefügt!`);
  };

  const deleteSubject = (subjectId: string) => {
    setSubjects(subjects.filter(s => s.id !== subjectId));
    toast.success('🗑️ Fach gelöscht!');
  };

  const deleteGrade = (subjectId: string, gradeId: string) => {
    setSubjects(subjects.map(subject => 
      subject.id === subjectId 
        ? { ...subject, grades: subject.grades.filter(g => g.id !== gradeId) }
        : subject
    ));
    toast.success('🗑️ Note gelöscht!');
  };

  const overallGPA = calculateOverallGPA(subjects);

  // Flatten all grades for achievement system
  const allGrades = subjects.flatMap(subject => 
    subject.grades.map(grade => ({
      ...grade,
      subjectId: subject.id
    }))
  );

  const handleExport = () => {
    if (!user) {
      toast.error('Bitte melde dich an, um den Export zu nutzen');
      return;
    }
    
    setShowExportDialog(true);
  };

  return (
    <div className="min-h-screen theme-background">
      <Header onSync={handleManualSync} syncLoading={syncLoading} />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        <MotivationalQuotes />

        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Meine Noten</h1>
                <p className="text-sm lg:text-base text-gray-600">Verwalte deine Noten und behalte den Überblick</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button onClick={handleExport} variant="outline" className="gap-2 text-sm">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button onClick={() => setShowAddSubject(true)} className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm">
                <Plus className="w-4 h-4" />
                Fach hinzufügen
              </Button>
            </div>
          </div>

          {/* Overall GPA Card */}
          {subjects.length > 0 && (
            <Card className={`${getGradeBackground(overallGPA)} border-2 mb-6`}>
              <CardContent className="p-4 lg:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Gesamtdurchschnitt</h3>
                      <p className="text-sm lg:text-base text-gray-600">Durchschnitt aller Fächer</p>
                    </div>
                  </div>
                  <div className={`text-3xl lg:text-4xl font-bold ${getGradeColor(overallGPA)}`}>
                    {formatGrade(overallGPA)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Achievement System */}
        {subjects.length > 0 && (
          <AchievementSystem subjects={subjects} grades={allGrades} />
        )}

        {/* Goal Tracker */}
        {subjects.length > 0 && (
          <GoalTracker subjects={subjects} grades={allGrades} />
        )}

        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
            <TabsTrigger value="subjects" className="text-xs lg:text-sm px-2">Fächer & Noten</TabsTrigger>
            <TabsTrigger value="trends" className="text-xs lg:text-sm px-2">Trends</TabsTrigger>
            <TabsTrigger value="study" className="text-xs lg:text-sm px-2 hidden lg:flex">Lerncoach</TabsTrigger>
            <TabsTrigger value="stats" className="text-xs lg:text-sm px-2 hidden lg:flex">Statistiken</TabsTrigger>
          </TabsList>

          {/* Mobile-only additional tabs */}
          <div className="lg:hidden mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="study" className="text-xs px-2">Lerncoach</TabsTrigger>
              <TabsTrigger value="stats" className="text-xs px-2">Statistiken</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="subjects" className="space-y-4">
            {subjects.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Noch keine Fächer hinzugefügt</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Erstelle dein erstes Fach, um mit der Notenverwaltung zu beginnen
                  </p>
                  <Button onClick={() => setShowAddSubject(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Erstes Fach hinzufügen
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {subjects.map(subject => (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    onAddGrade={(subject) => {
                      setSelectedSubject(subject);
                      setShowAddGrade(true);
                    }}
                    onDeleteSubject={deleteSubject}
                    onDeleteGrade={deleteGrade}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold">Notenverläufe</h2>
              </div>
              <GradeTrendChart subjects={subjects} />
            </div>
          </TabsContent>

          <TabsContent value="study">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold">Lerncoach</h2>
              </div>
              <StudyCards subjects={subjects} />
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <OverallStats subjects={subjects} />
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <AddSubjectDialog
          open={showAddSubject}
          onOpenChange={setShowAddSubject}
          onAddSubject={addSubject}
        />
        
        <AddGradeDialog
          open={showAddGrade}
          onOpenChange={setShowAddGrade}
          subject={selectedSubject}
          onAddGrade={addGrade}
        />
        
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          subjects={subjects}
        />
      </div>

      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};