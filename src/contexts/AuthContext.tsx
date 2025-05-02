
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
    console.log("AuthProvider inicializando...");
    initializeStorage();
    
    // Check for existing session
    const checkSession = async () => {
      const storedCedula = localStorage.getItem('user_cedula');
      console.log("Cédula almacenada:", storedCedula);
      
      if (storedCedula) {
        setIsAuthenticated(true);
        setUserId(storedCedula);
        
        // Check if admin
        if (storedCedula === 'admin') {
          console.log("Usuario detectado como administrador");
          setIsAdmin(true);
        }

        // Set current user
        try {
          if (storedCedula !== 'admin') {
            const aspirante = await getAspiranteByCredentials(storedCedula, '');
            if (aspirante) {
              console.log("Aspirante cargado:", aspirante);
              setCurrentUser(aspirante);
            } else {
              console.log("No se encontró información del aspirante");
            }
          }
        } catch (error) {
          console.error('Error loading current user:', error);
        }
      } else {
        console.log("No hay sesión almacenada");
      }
    };
    
    checkSession();
  }, []);

  const login = async (cedula: string, opec: string): Promise<boolean> => {
    try {
      console.log("Intentando iniciar sesión con:", cedula, opec);
      
      // Caso especial para el admin
      if (cedula === 'admin' && opec === '87453609') {
        console.log("Login de administrador exitoso");
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUserId('admin');
        localStorage.setItem('user_cedula', 'admin');
        return true;
      }
      
      const foundAspirante = await getAspiranteByCredentials(cedula, opec);
      
      if (foundAspirante) {
        console.log("Login exitoso para aspirante:", foundAspirante);
        setIsAuthenticated(true);
        setUserId(cedula);
        setCurrentUser(foundAspirante);
        
        // Store credentials in localStorage
        localStorage.setItem('user_cedula', cedula);
        
        return true;
      }
      
      console.log("Credenciales inválidas");
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log("Cerrando sesión");
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserId(null);
    setCurrentUser(null);
    localStorage.removeItem('user_cedula');
    navigate('/');
  };

  const clearAllSelections = async (): Promise<boolean> => {
    if (!isAdmin) {
      console.error('Solo el administrador puede borrar todas las selecciones');
      return false;
    }
    
    try {
      console.log('Iniciando proceso para borrar todas las selecciones...');
      
      // 1. Actualizar en Supabase - usar el método correcto
      const { error } = await supabase
        .from('aspirantes')
        .update({ plaza_deseada: null })
        .neq('cedula', 'no-existe'); // Asegurarnos de actualizar todas las filas
      
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
      
      return success;
    } catch (error) {
      console.error('Error en clearAllSelections:', error);
      return false;
    }
  };

  const verifyIdentity = (cedula: string): boolean => {
    // Verificar identidad del aspirante
    const result = isAuthenticated && (isAdmin || userId === cedula);
    console.log("Verificando identidad:", { cedula, userId, isAdmin, resultado: result });
    return result;
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
