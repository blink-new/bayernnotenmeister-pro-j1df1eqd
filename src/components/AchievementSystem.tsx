import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, TrendingUp, Calendar, Zap, Award, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface Grade {
  value: string;
  [key: string]: unknown;
}

interface Subject {
  name: string;
  [key: string]: unknown;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
}

interface AchievementSystemProps {
  subjects: Subject[];
  grades: Grade[];
}

export function AchievementSystem({ subjects, grades }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Define all achievements
  const achievementDefinitions: Omit<Achievement, 'unlocked' | 'progress' | 'unlockedAt'>[] = [
    {
      id: 'first_grade',
      title: 'Erste Note! 📝',
      description: 'Deine erste Note eingetragen',
      icon: <Star className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      maxProgress: 1
    },
    {
      id: 'excellent_student',
      title: 'Musterschüler 🌟',
      description: 'Durchschnitt von 1.5 oder besser erreicht',
      icon: <Trophy className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      maxProgress: 1
    },
    {
      id: 'grade_collector',
      title: 'Notensammler 📚',
      description: '25 Noten eingetragen',
      icon: <Target className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      maxProgress: 25
    },
    {
      id: 'improvement_master',
      title: 'Verbesserungsmeister 📈',
      description: 'Durchschnitt um 0.5 Punkte verbessert',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      maxProgress: 1
    },
    {
      id: 'consistent_student',
      title: 'Beständiger Schüler ⚡',
      description: '7 Tage in Folge Noten eingetragen',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      maxProgress: 7
    },
    {
      id: 'speed_demon',
      title: 'Blitzschnell ⚡',
      description: '5 Noten in einer Sitzung eingetragen',
      icon: <Zap className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      maxProgress: 5
    },
    {
      id: 'subject_master',
      title: 'Fächermeister 🎯',
      description: 'Alle Hauptfächer erfasst',
      icon: <Award className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-teal-500 to-blue-500',
      maxProgress: 5
    },
    {
      id: 'perfectionist',
      title: 'Perfektionist ✨',
      description: 'Mindestens 3 Einsen erreicht',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-gradient-to-r from-pink-500 to-rose-500',
      maxProgress: 3
    }
  ];

  // Calculate achievement progress
  useEffect(() => {
    const updatedAchievements = achievementDefinitions.map(def => {
      let progress = 0;
      let unlocked = false;

      switch (def.id) {
        case 'first_grade': {
          progress = grades.length > 0 ? 1 : 0;
          break;
        }

        case 'excellent_student': {
          const totalGrades = grades.length;
          if (totalGrades > 0) {
            const avg = grades.reduce((sum, grade) => sum + parseFloat(grade.value), 0) / totalGrades;
            progress = avg <= 1.5 ? 1 : 0;
          }
          break;
        }

        case 'grade_collector': {
          progress = Math.min(grades.length, def.maxProgress);
          break;
        }

        case 'improvement_master': {
          // Simplified - would need historical data for real improvement tracking
          progress = grades.length >= 10 ? 1 : 0;
          break;
        }

        case 'consistent_student': {
          // Simplified - would need date tracking for real consistency
          progress = grades.length >= 7 ? 7 : grades.length;
          break;
        }

        case 'speed_demon': {
          // Simplified - would need session tracking
          progress = Math.min(grades.length, def.maxProgress);
          break;
        }

        case 'subject_master': {
          const mainSubjects = ['Deutsch', 'Mathematik', 'Englisch', 'Französisch', 'Latein'];
          const existingMainSubjects = subjects.filter(s => 
            mainSubjects.some(main => s.name.toLowerCase().includes(main.toLowerCase()))
          ).length;
          progress = Math.min(existingMainSubjects, def.maxProgress);
          break;
        }

        case 'perfectionist': {
          const excellentGrades = grades.filter(g => parseFloat(g.value) <= 1.0).length;
          progress = Math.min(excellentGrades, def.maxProgress);
          break;
        }
      }

      unlocked = progress >= def.maxProgress;

      return {
        ...def,
        progress,
        unlocked,
        unlockedAt: unlocked ? new Date() : undefined
      };
    });

    // Check for newly unlocked achievements
    const newUnlocked = updatedAchievements.filter(
      achievement => 
        achievement.unlocked && 
        !achievements.find(prev => prev.id === achievement.id && prev.unlocked)
    );

    if (newUnlocked.length > 0) {
      setNewlyUnlocked(newUnlocked);
      // Auto-hide after 5 seconds
      setTimeout(() => setNewlyUnlocked([]), 5000);
    }

    setAchievements(updatedAchievements);
  }, [subjects, grades, achievements]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <>
      {/* Achievement notifications */}
      <AnimatePresence>
        {newlyUnlocked.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ delay: index * 0.2 }}
            className="fixed top-20 right-4 z-50 max-w-sm"
          >
            <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${achievement.color}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Achievement freigeschaltet!</div>
                    <div className="text-sm text-gray-700 font-medium">{achievement.title}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Achievement overview */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🏆 Achievements
            </h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {unlockedCount}/{totalCount}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  achievement.unlocked
                    ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50'
                    : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                    achievement.unlocked ? achievement.color : 'bg-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </div>
                  </div>
                </div>

                <p className={`text-xs mb-3 ${
                  achievement.unlocked ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>

                {!achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Fortschritt</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {achievement.unlocked && (
                  <div className="flex items-center gap-1 text-xs text-yellow-700">
                    <Trophy className="w-3 h-3" />
                    Freigeschaltet!
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}