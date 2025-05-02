
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import MunicipalitySelection from '@/components/MunicipalitySelection';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useParams } from 'react-router-dom';

const MunicipalityPage: React.FC = () => {
  const { isAuthenticated, verifyIdentity } = useAuth();
  const { cedula } = useParams<{ cedula: string }>();

  // Verificar si hay un cédula en la URL y si el usuario está autorizado
  const isAuthorized = cedula ? verifyIdentity(cedula) : false;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (cedula && !isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1">
        <MunicipalitySelection />
      </div>
      
      <footer className="py-4 bg-aeronautica text-white text-center text-sm">
        <p>AUDIENCIA PÚBLICA - AERONAUTICA CIVIL - OPEC 209961</p>
      </footer>
    </div>
  );
};

export default MunicipalityPage;
