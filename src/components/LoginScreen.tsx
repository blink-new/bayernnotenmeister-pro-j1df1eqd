import React, { useState } from 'react';
import { GraduationCap, Calculator, BookOpen, FileText, Cloud, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export const LoginScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password, fullName)
        : await signIn(email, password);

      if (error) {
        toast.error(error.message || 'Ein Fehler ist aufgetreten');
      } else {
        toast.success(isSignUp ? 'Konto erfolgreich erstellt!' : 'Erfolgreich angemeldet!');
      }
    } catch {
      toast.error('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        {/* Left Side - Hero Content */}
        <div className="text-center lg:text-left order-2 lg:order-1">
          <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 mb-4 lg:mb-6">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <h1 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bayernnotenmeister Pro
            </h1>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
            Verwalte deine Noten
            <span className="block text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              wie ein Profi
            </span>
          </h2>
          
          <p className="text-base lg:text-xl text-gray-600 mb-6 lg:mb-8">
            Die moderne Notenrechner-App für bayerische Schüler. Behalte den Überblick 
            über deine Leistungen und berechne deine Noten nach dem bayerischen System.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white/70 rounded-lg">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-3 h-3 lg:w-4 lg:h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Intelligente Berechnung</h3>
                <p className="text-xs lg:text-sm text-gray-600">Automatische Notenberechnung nach bayerischem System</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white/70 rounded-lg">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-3 h-3 lg:w-4 lg:h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Fächer-Management</h3>
                <p className="text-xs lg:text-sm text-gray-600">Organisiere alle deine Schulfächer an einem Ort</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white/70 rounded-lg">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-3 h-3 lg:w-4 lg:h-4 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">PDF Export</h3>
                <p className="text-xs lg:text-sm text-gray-600">Exportiere deine Noten als übersichtliche PDF</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3 p-3 lg:p-4 bg-white/70 rounded-lg">
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Cloud className="w-3 h-3 lg:w-4 lg:h-4 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Cloud Sync</h3>
                <p className="text-xs lg:text-sm text-gray-600">Deine Daten sind sicher und überall verfügbar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full max-w-md mx-auto order-1 lg:order-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 lg:p-8 border border-white/20">
            <div className="text-center mb-6 lg:mb-8">
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                {isSignUp ? 'Konto erstellen' : 'Anmelden'}
              </h3>
              <p className="text-sm lg:text-base text-gray-600">
                {isSignUp 
                  ? 'Erstelle dein kostenloses Konto und starte durch' 
                  : 'Melde dich in deinem Konto an'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vollständiger Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Max Mustermann"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="max@beispiel.de"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passwort
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 text-sm lg:text-base rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 lg:py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm lg:text-base"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Wird verarbeitet...
                  </>
                ) : (
                  <>
                    {isSignUp ? 'Konto erstellen' : 'Anmelden'}
                    <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 lg:mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm lg:text-base"
              >
                {isSignUp 
                  ? 'Bereits ein Konto? Jetzt anmelden' 
                  : 'Noch kein Konto? Jetzt registrieren'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};