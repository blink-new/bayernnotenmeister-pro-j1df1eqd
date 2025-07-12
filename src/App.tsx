import { AuthProvider, useAuth } from './contexts/AuthContext'
import { GradeManager } from './components/GradeManager'
import { LoginScreen } from './components/LoginScreen'
import { Toaster } from 'react-hot-toast'

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">App wird geladen...</p>
        </div>
      </div>
    );
  }

  return user ? <GradeManager /> : <LoginScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  )
}

export default App