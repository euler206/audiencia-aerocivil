
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAspiranteByCredentials } from '@/lib/aspirantes';
import { clearAllSelections } from '@/lib/vacancies';

// Defining an interface for the aspirante/user data
interface CurrentUser {
  cedula: string;
  nombre: string;
  puntaje: number;
  puesto: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  cedula: string | null;
  currentUser: CurrentUser | null;
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
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
      } else {
        // Cargar datos del usuario si no es admin
        getAspiranteByCredentials(savedCedula, '209961')
          .then(aspirante => {
            if (aspirante) {
              setCurrentUser({
                cedula: aspirante.cedula,
                nombre: aspirante.nombre,
                puntaje: aspirante.puntaje,
                puesto: aspirante.puesto
              });
            }
          })
          .catch(error => console.error('Error al cargar datos del usuario:', error));
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
        setCurrentUser(null); // Admin no tiene datos de usuario
        localStorage.setItem('cedula', 'admin');
        return true;
      }
      
      // Verificar credenciales
      const aspirante = await getAspiranteByCredentials(cedulaInput, opec);
      
      if (aspirante) {
        setCedula(cedulaInput);
        setIsAuthenticated(true);
        setIsAdmin(false);
        setCurrentUser({
          cedula: aspirante.cedula,
          nombre: aspirante.nombre,
          puntaje: aspirante.puntaje,
          puesto: aspirante.puesto
        });
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
    setCurrentUser(null);
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
      currentUser,
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
