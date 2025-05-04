
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import MunicipalitySelection from '@/components/MunicipalitySelection';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
import { loadFromLocalStorage } from '@/lib/storage';

const MunicipalityPage: React.FC = () => {
  const { isAuthenticated, verifyIdentity } = useAuth();
  const { cedula } = useParams<{ cedula: string }>();

  useEffect(() => {
    // Cargar datos desde localStorage/Supabase al inicio
    const loadInitialData = async () => {
      try {
        await loadFromLocalStorage();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    
    loadInitialData();
    
    // Añadir un log para depuración
    console.log("MunicipalityPage renderizado:", { isAuthenticated, cedula });
  }, [isAuthenticated, cedula]);

  // Verificar si hay un cédula en la URL y si el usuario está autorizado
  const isAuthorized = cedula ? verifyIdentity(cedula) : false;

  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo a página principal");
    return <Navigate to="/" replace />;
  }

  if (cedula && !isAuthorized) {
    console.log("No autorizado para esta cédula, redirigiendo al dashboard");
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
