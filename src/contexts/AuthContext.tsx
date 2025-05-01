import React, { createContext, useState, useContext, useEffect, useNavigate } from 'react';
import { getAspiranteByCredentials, Aspirante, initializeStorage, updateAllPlazasDeseadas } from '@/lib';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (cedula: string, opec: string) => Promise<boolean>;
  logout: () => void;
  userId: string | null;
  clearAllSelections: () => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  userId: null,
  clearAllSelections: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize storage when app loads
  useEffect(() => {
    initializeStorage();
    
    // Check for existing session
    const checkSession = async () => {
      const storedCedula = localStorage.getItem('user_cedula');
      if (storedCedula) {
        setIsAuthenticated(true);
        setUserId(storedCedula);
        
        // Check if admin
        if (storedCedula === '1082982133') {
          setIsAdmin(true);
        }
      }
    };
    
    checkSession();
  }, []);

  const login = async (cedula: string, opec: string): Promise<boolean> => {
    try {
      const foundAspirante = await getAspiranteByCredentials(cedula, opec);
      
      if (foundAspirante) {
        setIsAuthenticated(true);
        setUserId(cedula);
        
        // Special admin user
        if (cedula === '1082982133') {
          setIsAdmin(true);
        }
        
        // Store credentials in localStorage
        localStorage.setItem('user_cedula', cedula);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null);
    localStorage.removeItem('user_cedula');
    navigate('/');
  };

  const clearAllSelections = (): boolean => {
    if (isAdmin) {
      updateAllPlazasDeseadas();
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAdmin, 
        login, 
        logout,
        userId,
        clearAllSelections
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
