import { ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Login } from './Auth/Login';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#bfa078]/20 border-t-[#bfa078] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};
