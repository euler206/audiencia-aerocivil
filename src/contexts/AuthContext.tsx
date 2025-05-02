
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAspiranteByCredentials, Aspirante, initializeStorage, updateAllPlazasDeseadas } from '@/lib';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (cedula: string, opec: string) => Promise<boolean>;
  logout: () => void;
  userId: string | null;
  currentUser: Aspirante | null;
  clearAllSelections: () => Promise<boolean>;
  verifyIdentity: (cedula: string) => boolean;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  userId: null,
  currentUser: null,
  clearAllSelections: async () => false,
  verifyIdentity: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<Aspirante | null>(null);
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
        
        // Check if admin (corregido para incluir ambos ID de administrador)
        if (storedCedula === 'admin') {
          setIsAdmin(true);
        }

        // Set current user
        try {
          const aspirante = await getAspiranteByCredentials(storedCedula, '');
          if (aspirante) {
            setCurrentUser(aspirante);
          }
        } catch (error) {
          console.error('Error loading current user:', error);
        }
      }
    };
    
    checkSession();
  }, []);

  const login = async (cedula: string, opec: string): Promise<boolean> => {
    try {
      // Caso especial para el admin
      if (cedula === 'admin' && opec === '87453609') {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUserId('admin');
        localStorage.setItem('user_cedula', 'admin');
        return true;
      }
      
      const foundAspirante = await getAspiranteByCredentials(cedula, opec);
      
      if (foundAspirante) {
        setIsAuthenticated(true);
        setUserId(cedula);
        setCurrentUser(foundAspirante);
        
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
    setCurrentUser(null);
    localStorage.removeItem('user_cedula');
    navigate('/');
  };

  const clearAllSelections = async (): Promise<boolean> => {
    if (isAdmin) {
      try {
        console.log('Iniciando proceso para borrar todas las selecciones...');
        
        // 1. Actualizar en Supabase
        const { error } = await supabase
          .from('aspirantes')
          .update({ plaza_deseada: null });
        
        if (error) {
          console.error('Error limpiando selecciones en Supabase:', error);
          return false;
        }
        
        console.log('Selecciones borradas correctamente en Supabase');
        
        // 2. Borrar todas las prioridades almacenadas
        const { error: errorPrioridades } = await supabase
          .from('prioridades')
          .delete()
          .neq('id', 0);
        
        if (errorPrioridades) {
          console.error('Error borrando prioridades en Supabase:', errorPrioridades);
        } else {
          console.log('Prioridades borradas correctamente en Supabase');
        }
        
        // 3. Actualizar datos locales después de la operación exitosa en Supabase
        const success = await updateAllPlazasDeseadas();
        console.log('Resultado de actualización local:', success);
        
        return true;
      } catch (error) {
        console.error('Error en clearAllSelections:', error);
        return false;
      }
    }
    return false;
  };

  const verifyIdentity = (cedula: string): boolean => {
    // Verificar identidad del aspirante
    return isAuthenticated && (isAdmin || userId === cedula);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isAdmin, 
        login, 
        logout,
        userId,
        currentUser,
        clearAllSelections,
        verifyIdentity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
