import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Landing } from './components/Landing';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { ForgotPassword } from './components/Auth/ForgotPassword';
import { Dashboard } from './components/Dashboard/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

const Router = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!loading && user && currentPath === '/') {
      window.history.pushState({}, '', '/dashboard');
      setCurrentPath('/dashboard');
    }
  }, [user, loading, currentPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#bfa078]/20 border-t-[#bfa078] rounded-full animate-spin" />
      </div>
    );
  }

  switch (currentPath) {
    case '/login':
      return user ? <Dashboard /> : <Login />;
    case '/signup':
      return user ? <Dashboard /> : <Signup />;
    case '/forgot-password':
      return user ? <Dashboard /> : <ForgotPassword />;
    case '/dashboard':
      return (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      );
    default:
      return user ? <Dashboard /> : <Landing />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
