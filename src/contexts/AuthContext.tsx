
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAspiranteByCredentials } from '@/lib/aspirantes';
import { clearAllSelections } from '@/lib/vacancies';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  cedula: string | null;
  login: (cedula: string, opec: string) => Promise<boolean>;
  logout: () => void;
  verifyIdentity: (cedula: string) => boolean;
  clearAllSelections: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cedula, setCedula] = useState<string | null>(null);

  useEffect(() => {
    console.info('AuthProvider inicializando...');
    // Verificar si hay sesión guardada
    const savedCedula = localStorage.getItem('cedula');
    if (savedCedula) {
      console.info('Cédula almacenada:', savedCedula);
      setCedula(savedCedula);
      setIsAuthenticated(true);
      
      // Verificar si es admin
      if (savedCedula === 'admin') {
        console.info('Usuario detectado como administrador');
        setIsAdmin(true);
      }
    }
  }, []);
  
  // Función para iniciar sesión
  const login = async (cedulaInput: string, opec: string): Promise<boolean> => {
    try {
      console.log(`Intentando login con cédula: ${cedulaInput}, OPEC: ${opec}`);
      
      // Caso especial para admin
      if (cedulaInput === 'admin') {
        setCedula('admin');
        setIsAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('cedula', 'admin');
        return true;
      }
      
      // Verificar credenciales
      const aspirante = await getAspiranteByCredentials(cedulaInput, opec);
      
      if (aspirante) {
        setCedula(cedulaInput);
        setIsAuthenticated(true);
        setIsAdmin(false);
        localStorage.setItem('cedula', cedulaInput);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setCedula(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('cedula');
  };

  // Verificar identidad para acceso específico
  const verifyIdentity = (targetCedula: string): boolean => {
    return isAdmin || cedula === targetCedula;
  };

  // Función para borrar todas las selecciones (solo admin)
  const handleClearAllSelections = async (): Promise<boolean> => {
    if (!isAdmin) {
      console.error('Solo administradores pueden borrar todas las selecciones');
      return false;
    }
    
    try {
      return await clearAllSelections();
    } catch (error) {
      console.error('Error al borrar selecciones:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isAdmin,
      cedula,
      login,
      logout,
      verifyIdentity,
      clearAllSelections: handleClearAllSelections
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

