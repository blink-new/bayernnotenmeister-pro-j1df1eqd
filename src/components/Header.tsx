import React, { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Cloud, CloudOff, User, LogOut, Settings, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthDialog } from './AuthDialog';
import { ProfileSettings } from './ProfileSettings';
import { toast } from 'react-hot-toast';

interface HeaderProps {
  onSync?: () => void;
  syncLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSync, syncLoading }) => {
  const { user, signOut } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Erfolgreich abgemeldet');
    } catch {
      toast.error('Fehler beim Abmelden');
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

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-lg">B</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">
                  Bayernnotenmeister Pro
                </h1>
                <p className="text-xs lg:text-sm text-gray-500">
                  Dein digitaler Notenplaner
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-sm font-bold text-gray-900">
                  Notenmeister
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2 lg:space-x-4">
              {user ? (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="hidden sm:flex items-center space-x-2">
                    <Cloud className="w-3 h-3 lg:w-4 lg:h-4 text-green-500" />
                    <span className="text-xs lg:text-sm text-green-600 font-medium">
                      Synchronisiert
                    </span>
                  </div>
                  
                  {onSync && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onSync}
                      disabled={syncLoading}
                      className="flex items-center space-x-1 lg:space-x-2 px-2 lg:px-3"
                    >
                      <RefreshCw className={`w-3 h-3 lg:w-4 lg:h-4 ${syncLoading ? 'animate-spin' : ''}`} />
                      <span className="hidden sm:inline text-xs lg:text-sm">{syncLoading ? 'Sync...' : 'Sync'}</span>
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-7 w-7 lg:h-8 lg:w-8 rounded-full">
                        <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
                          <AvatarFallback className="text-xs lg:text-sm">
                            {getUserInitials(user.user_metadata?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 lg:w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.user_metadata?.full_name || 'Benutzer'}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowProfileSettings(true)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Einstellungen</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Abmelden</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <div className="hidden sm:flex items-center space-x-2">
                    <CloudOff className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
                    <span className="text-xs lg:text-sm text-gray-500">
                      Nicht sync
                    </span>
                  </div>
                  <Button
                    onClick={() => setShowAuthDialog(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-2 lg:px-4 py-1 lg:py-2 text-xs lg:text-sm"
                    size="sm"
                  >
                    <Cloud className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    <span className="hidden sm:inline">Cloud-Sync</span>
                    <span className="sm:hidden">Sync</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog 
        open={showAuthDialog} 
        onOpenChange={setShowAuthDialog}
      />
      
      <ProfileSettings 
        open={showProfileSettings} 
        onOpenChange={setShowProfileSettings}
      />
    </>
  );
};