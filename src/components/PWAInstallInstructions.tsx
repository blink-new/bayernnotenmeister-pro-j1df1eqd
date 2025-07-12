import { motion } from 'framer-motion';
import { Smartphone, Share, Plus, Download, Chrome, Safari } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function PWAInstallInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  const isChrome = /Chrome/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !isChrome;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          App Installation
          {isIOS && <Badge variant="outline">iOS</Badge>}
          {isAndroid && <Badge variant="outline">Android</Badge>}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* iOS Safari Instructions */}
        {isIOS && isSafari && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Safari className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold">Installation in Safari (iOS)</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Teilen-Button antippen</p>
                  <p className="text-sm text-gray-600">Tippe auf das <Share className="w-4 h-4 inline mx-1" /> Symbol unten in der Mitte</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">"Zum Home-Bildschirm" wählen</p>
                  <p className="text-sm text-gray-600">Scrolle nach unten und wähle <Plus className="w-4 h-4 inline mx-1" /> "Zum Home-Bildschirm"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">"Hinzufügen" bestätigen</p>
                  <p className="text-sm text-gray-600">Tippe auf "Hinzufügen" - die App erscheint auf deinem Home-Bildschirm!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Android Chrome Instructions */}
        {isAndroid && isChrome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Chrome className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold">Installation in Chrome (Android)</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Menü öffnen</p>
                  <p className="text-sm text-gray-600">Tippe auf die drei Punkte (⋮) oben rechts</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">"App installieren" wählen</p>
                  <p className="text-sm text-gray-600">Wähle <Download className="w-4 h-4 inline mx-1" /> "App installieren" oder "Zum Startbildschirm hinzufügen"</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Installation bestätigen</p>
                  <p className="text-sm text-gray-600">Tippe auf "Installieren" - die App wird auf deinem Gerät installiert!</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* General Instructions */}
        {(!isIOS && !isAndroid) || (!isSafari && !isChrome) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold">App Installation</h3>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Schaue nach einem "Installieren" oder "Zur Startseite hinzufügen" Button in deinem Browser-Menü, 
                um Bayernnotenmeister Pro als App zu installieren.
              </p>
              
              <div className="mt-3 space-y-2 text-xs text-gray-600">
                <p><strong>Chrome/Edge:</strong> Menü → "App installieren"</p>
                <p><strong>Firefox:</strong> Menü → "Zur Startseite hinzufügen"</p>
                <p><strong>Safari (iOS):</strong> Teilen → "Zum Home-Bildschirm"</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Benefits */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 text-gray-900">Vorteile der App-Installation:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✨ Schneller Zugriff über das App-Symbol</li>
            <li>📱 Vollbild-Erlebnis ohne Browser-Interface</li>
            <li>⚡ Offline-Funktionalität für deine Noten</li>
            <li>🔔 Push-Benachrichtigungen für Lernremindr</li>
            <li>🚀 Bessere Performance und Geschwindigkeit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}