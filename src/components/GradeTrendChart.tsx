import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Subject } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

interface GradeTrendChartProps {
  subjects: Subject[];
}

export const GradeTrendChart = ({ subjects }: GradeTrendChartProps) => {
  const getSubjectTrendData = (subject: Subject) => {
    const sortedGrades = [...subject.grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return sortedGrades.map((grade, index) => ({
      index: index + 1,
      value: grade.value,
      date: new Date(grade.date).toLocaleDateString('de-DE', { 
        month: 'short', 
        day: 'numeric' 
      }),
      type: grade.type
    }));
  };

  const getTrendDirection = (subject: Subject) => {
    if (subject.grades.length < 2) return 'stable';
    
    const sortedGrades = [...subject.grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstHalf = sortedGrades.slice(0, Math.floor(sortedGrades.length / 2));
    const secondHalf = sortedGrades.slice(Math.floor(sortedGrades.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, g) => sum + g.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, g) => sum + g.value, 0) / secondHalf.length;
    
    if (secondAvg < firstAvg - 0.3) return 'improving';
    if (secondAvg > firstAvg + 0.3) return 'declining';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendMessage = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Verbesserung erkennbar! 📈';
      case 'declining':
        return 'Achtung: Verschlechterung 📉';
      default:
        return 'Konstante Leistung 📊';
    }
  };

  const subjectsWithTrends = subjects
    .filter(s => s.grades.length >= 2)
    .map(subject => ({
      ...subject,
      trend: getTrendDirection(subject),
      trendData: getSubjectTrendData(subject)
    }));

  if (subjectsWithTrends.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Noch keine Trends verfügbar
          </h3>
          <p className="text-gray-600">
            Füge mindestens 2 Noten pro Fach hinzu, um Trends zu sehen
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {subjectsWithTrends.map((subject, index) => (
        <motion.div
          key={subject.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{subject.name}</span>
                  {subject.isMainSubject && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Hauptfach
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(subject.trend)}
                  <span className={`text-sm font-medium ${getTrendColor(subject.trend)}`}>
                    {getTrendMessage(subject.trend)}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subject.trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      domain={[1, 6]} 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      formatter={(value) => [value, 'Note']}
                      labelFormatter={(label) => `Datum: ${label}`}
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <ReferenceLine y={4} stroke="#ef4444" strokeDasharray="5 5" />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ 
                        fill: '#3b82f6', 
                        strokeWidth: 2, 
                        r: 5 
                      }}
                      activeDot={{ 
                        r: 7, 
                        stroke: '#3b82f6', 
                        strokeWidth: 2 
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Erste Note: {subject.trendData[0]?.value}</span>
                <span>Letzte Note: {subject.trendData[subject.trendData.length - 1]?.value}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};