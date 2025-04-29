
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) return null;

  return (
    <header className="bg-aeronautica text-aeronautica-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-3 sm:mb-0">
            <h1 className="text-xl font-bold mr-2">SIMULACRO AUDIENCIA PÚBLICA</h1>
            <span className="text-xs bg-aeronautica-light px-2 py-0.5 rounded">OPEC 209961</span>
            {isAdmin && (
              <span className="ml-2 text-xs bg-red-500 px-2 py-0.5 rounded">MODO ADMINISTRADOR</span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="font-medium">{currentUser.nombre}</div>
              <div className="text-sm text-aeronautica-foreground/80">
                <span className="font-semibold">Cédula:</span> {currentUser.cedula} | 
                <span className="font-semibold"> Puesto:</span> {currentUser.puesto} | 
                <span className="font-semibold"> Puntaje:</span> {currentUser.puntaje}
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleLogout} 
              className="border-none"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
