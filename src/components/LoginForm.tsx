
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const LoginForm: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [opec, setOpec] = useState('209961');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Asegurar que la cédula se trate como string
      const cedulaString = String(cedula).trim();
      const opecString = String(opec).trim();
      
      console.log("Intentando login con:", cedulaString, opecString);
      
      const success = await login(cedulaString, opecString);
      
      if (success) {
        toast.success('Inicio de sesión exitoso');
        navigate('/dashboard');
      } else {
        toast.error('Credenciales inválidas. Verifique su número de cédula y OPEC.');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión. Intente nuevamente.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 bg-aeronautica text-aeronautica-foreground rounded-t-md">
          <CardTitle className="text-2xl text-center">AUDIENCIA</CardTitle>
          <CardDescription className="text-aeronautica-foreground/90 text-center">
            Proceso de Audiencia Pública AERONAUTICA CIVIL - OPEC 209961
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="cedula" className="text-sm font-medium">
                Número de Identificación
              </label>
              <Input
                id="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                placeholder="Ingrese su número de cédula"
                required
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="opec" className="text-sm font-medium">
                Número OPEC
              </label>
              <Input
                id="opec"
                type="text"
                value={opec}
                onChange={(e) => setOpec(e.target.value)}
                placeholder="Ingrese el número OPEC"
                required
                className="bg-gray-50"
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-aeronautica hover:bg-aeronautica-light" 
            onClick={handleSubmit} 
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
