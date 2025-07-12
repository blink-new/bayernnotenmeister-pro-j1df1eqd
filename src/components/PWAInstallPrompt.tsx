import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { usePWA } from '../hooks/usePWA';

export function PWAInstallPrompt() {
  const { isInstallable, isOffline, showInstallPrompt, dismissInstallPrompt } = usePWA();

  if (!isInstallable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm"
      >
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4">
          {/* Offline indicator */}
          {isOffline && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-2 text-amber-800 text-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                Offline Modus aktiv
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                App installieren
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-1 leading-relaxed">
                Installiere Bayernnotenmeister Pro auf deinem Gerät für den schnellen Zugriff und Offline-Nutzung!
              </p>
              
              <div className="flex items-center gap-2 mt-3">
                <Button 
                  onClick={showInstallPrompt}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 text-xs"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Installieren
                </Button>
                
                <Button 
                  onClick={dismissInstallPrompt}
                  variant="ghost" 
                  size="sm"
                  className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
                >
                  Später
                </Button>
              </div>
            </div>
            
            <Button
              onClick={dismissInstallPrompt}
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}