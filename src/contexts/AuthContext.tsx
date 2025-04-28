
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAspiranteByCredentials, Aspirante, initializeStorage, updateAllPlazasDeseadas } from '@/lib/data';

interface AuthContextType {
  currentUser: Aspirante | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (cedula: string, opec: string) => Promise<boolean>;
  logout: () => void;
  verifyIdentity: (cedula: string) => boolean;
  clearAllSelections: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Aspirante | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize data storage
    initializeStorage();
    
    // Check for existing auth session
    const savedUser = localStorage.getItem('currentUser');
    const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      setIsAdmin(savedIsAdmin);
    }
  }, []);

  const login = async (cedula: string, opec: string): Promise<boolean> => {
    // Verificar si es el usuario administrador
    if (cedula === 'admin' && opec === '87453609') {
      const adminUser: Aspirante = {
        puesto: 0,
        puntaje: 100,
        cedula: 'admin',
        nombre: 'Administrador',
        plazaDeseada: ''
      };
      
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('isAdmin', 'true');
      return true;
    }
    
    // Si no es administrador, verificar credenciales normales
    const cedulaString = String(cedula).trim();
    const opecString = String(opec).trim();
    
    const user = getAspiranteByCredentials(cedulaString, opecString);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      setIsAdmin(false);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('isAdmin', 'false');
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
  };

  const verifyIdentity = (cedula: string): boolean => {
    if (isAdmin) {
      return true; // El administrador puede ver cualquier información
    }
    return currentUser?.cedula === cedula;
  };

  // Nueva función para limpiar todas las selecciones de plazas
  const clearAllSelections = (): boolean => {
    if (!isAdmin) {
      return false; // Solo el administrador puede realizar esta acción
    }
    
    return updateAllPlazasDeseadas();
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      isAdmin, 
      login, 
      logout, 
      verifyIdentity,
      clearAllSelections
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
