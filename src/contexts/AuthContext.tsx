
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAspiranteByCredentials, Aspirante, initializeStorage } from '@/lib/data';

interface AuthContextType {
  currentUser: Aspirante | null;
  isAuthenticated: boolean;
  login: (cedula: string, opec: string) => Promise<boolean>;
  logout: () => void;
  verifyIdentity: (cedula: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Aspirante | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Initialize data storage
    initializeStorage();
    
    // Check for existing auth session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (cedula: string, opec: string): Promise<boolean> => {
    // Asegurarse de que la cédula se esté procesando como string
    const cedulaString = String(cedula).trim();
    const opecString = String(opec).trim();
    
    const user = getAspiranteByCredentials(cedulaString, opecString);
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const verifyIdentity = (cedula: string): boolean => {
    return currentUser?.cedula === cedula;
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, verifyIdentity }}>
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
