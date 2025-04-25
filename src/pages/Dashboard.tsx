
import React from 'react';
import Header from '@/components/Header';
import CandidateList from '@/components/CandidateList';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <CandidateList />
      </div>
      
      <footer className="py-4 bg-aeronautica text-white text-center text-sm">
        <p>AUDIENCIA PÚBLICA - AERONAUTICA CIVIL - OPEC 209961</p>
      </footer>
    </div>
  );
};

export default Dashboard;
