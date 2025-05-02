
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import CandidateList from '@/components/CandidateList';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Añadir un log para depuración
    console.log("Dashboard renderizado, estado de autenticación:", isAuthenticated);
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo a página principal");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <CandidateList />
      </div>
      
      <footer className="py-4 bg-aeronautica text-white text-center text-sm">
        <p>SIMULACRO AUDIENCIA PUBLICA - AERONAUTICA CIVIL - OPEC 209961</p>
      </footer>
    </div>
  );
};

export default Dashboard;
