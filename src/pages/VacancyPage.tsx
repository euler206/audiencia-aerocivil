
import React from 'react';
import Header from '@/components/Header';
import VacancyAuthentication from '@/components/VacancyAuthentication';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const VacancyPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <VacancyAuthentication />
      
      <footer className="py-4 bg-aeronautica text-white text-center text-sm mt-auto w-full">
        <p>SIMULACRO AUDIENCIA PUBLICA - AERONAUTICA CIVIL - OPEC 209961</p>
      </footer>
    </div>
  );
};

export default VacancyPage;
