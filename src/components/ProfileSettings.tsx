import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';

import { 
  User, 
  Settings, 
  Palette, 
  Moon, 
  Laptop, 
  Mountain, 
  Waves, 
  Trees, 
  Sparkles, 
  Sunset,
  GraduationCap,
  Award
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export type ThemeType = 'default' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'galaxy' | 'bavarian' | 'academic';

interface ProfileSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const themes = [
  {
    id: 'default' as ThemeType,
    name: 'Standard',
    description: 'Klassisches Bayern-Blau Design',
    icon: Laptop,
    gradient: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #f3e8ff 100%)',
    accent: 'linear-gradient(135deg, #2563eb, #9333ea)'
  },
  {
    id: 'ocean' as ThemeType,
    name: 'Ozean',
    description: 'Tiefblaue Meerestöne',
    icon: Waves,
    gradient: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 50%, #e0f2fe 100%)',
    accent: 'linear-gradient(135deg, #0891b2, #2563eb)'
  },
  {
    id: 'forest' as ThemeType,
    name: 'Wald',
    description: 'Natürliche Grüntöne',
    icon: Trees,
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)',
    accent: 'linear-gradient(135deg, #059669, #10b981)'
  },
  {
    id: 'sunset' as ThemeType,
    name: 'Sonnenuntergang',
    description: 'Warme Orange- und Rottöne',
    icon: Sunset,
    gradient: 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 50%, #fdf2f8 100%)',
    accent: 'linear-gradient(135deg, #ea580c, #dc2626)'
  },
  {
    id: 'galaxy' as ThemeType,
    name: 'Galaxie',
    description: 'Mystische Violett- und Pinktöne',
    icon: Sparkles,
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #fdf2f8 100%)',
    accent: 'linear-gradient(135deg, #9333ea, #ec4899)'
  },
  {
    id: 'bavarian' as ThemeType,
    name: 'Bayerisch',
    description: 'Traditionelle bayerische Farben',
    icon: Mountain,
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #dbeafe 100%)',
    accent: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)'
  },
  {
    id: 'academic' as ThemeType,
    name: 'Akademisch',
    description: 'Elegante Universitätsfarben',
    icon: GraduationCap,
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #f4f4f5 100%)',
    accent: 'linear-gradient(135deg, #334155, #374151)'
  },
  {
    id: 'dark' as ThemeType,
    name: 'Dunkel',
    description: 'Dunkles Design für abends',
    icon: Moon,
    gradient: 'linear-gradient(135deg, #111827 0%, #1e293b 50%, #111827 100%)',
    accent: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
  }
];

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const [notifications, setNotifications] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [gradeGoals, setGradeGoals] = useState(true);

  // Load settings from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    const savedNotifications = localStorage.getItem('notifications') === 'true';
    const savedAutoSync = localStorage.getItem('autoSync') === 'true';
    const savedGradeGoals = localStorage.getItem('gradeGoals') === 'true';

    if (savedTheme) setCurrentTheme(savedTheme);
    setNotifications(savedNotifications);
    setAutoSync(savedAutoSync);
    setGradeGoals(savedGradeGoals);
  }, []);

  // Apply theme to document
  useEffect(() => {
    const theme = themes.find(t => t.id === currentTheme);
    if (theme) {
      // Set CSS custom properties for the theme
      document.documentElement.style.setProperty('--theme-background', theme.gradient);
      document.documentElement.style.setProperty('--theme-accent', theme.accent);
      
      localStorage.setItem('theme', currentTheme);
    }
  }, [currentTheme]);

  const handleThemeChange = (themeId: ThemeType) => {
    setCurrentTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    toast.success(`🎨 ${theme?.name}-Theme aktiviert!`);
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    localStorage.setItem(setting, value.toString());
    
    switch (setting) {
      case 'notifications':
        setNotifications(value);
        toast.success(value ? '🔔 Benachrichtigungen aktiviert' : '🔕 Benachrichtigungen deaktiviert');
        break;
      case 'autoSync':
        setAutoSync(value);
        toast.success(value ? '🔄 Auto-Sync aktiviert' : '⏸️ Auto-Sync deaktiviert');
        break;
      case 'gradeGoals':
        setGradeGoals(value);
        toast.success(value ? '🎯 Notenziele aktiviert' : '📊 Notenziele deaktiviert');
        break;
    }
  };

  const getUserInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Profil & Einstellungen</h2>
            </div>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 mb-4">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-xl">
                        {getUserInitials(user?.user_metadata?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg">
                      {user?.user_metadata?.full_name || 'Benutzer'}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                    <Badge variant="secondary" className="mb-4">
                      <GraduationCap className="w-3 h-3 mr-1" />
                      Schüler
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Account-Typ</span>
                      <Badge variant="outline">Premium</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Mitglied seit</span>
                      <span className="text-sm">Januar 2024</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Theme Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Design & Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {themes.map((theme) => {
                      const IconComponent = theme.icon;
                      const isSelected = currentTheme === theme.id;
                      
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          className={`
                            p-4 rounded-lg border-2 transition-all hover:scale-105 relative overflow-hidden
                            ${isSelected 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                            }
                          `}
                        >
                          {/* Theme Preview Background */}
                          <div 
                            className="absolute inset-0 opacity-20"
                            style={{ background: theme.gradient }}
                          />
                          
                          <div className="relative z-10">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 mx-auto"
                              style={{ background: theme.accent }}
                            >
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm font-medium">{theme.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* App Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    App-Einstellungen
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Benachrichtigungen</h4>
                      <p className="text-sm text-gray-500">Erhalte Erinnerungen und Updates</p>
                    </div>
                    <Switch 
                      checked={notifications}
                      onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Automatische Synchronisation</h4>
                      <p className="text-sm text-gray-500">Daten automatisch in der Cloud speichern</p>
                    </div>
                    <Switch 
                      checked={autoSync}
                      onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notenziele</h4>
                      <p className="text-sm text-gray-500">Ziele setzen und Fortschritt verfolgen</p>
                    </div>
                    <Switch 
                      checked={gradeGoals}
                      onCheckedChange={(checked) => handleSettingChange('gradeGoals', checked)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Schnellstatistiken
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-sm text-gray-500">Fächer</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">2.3</div>
                      <div className="text-sm text-gray-500">⌀ Note</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">156</div>
                      <div className="text-sm text-gray-500">Einträge</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t flex justify-end">
            <Button onClick={() => onOpenChange(false)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Einstellungen speichern
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};