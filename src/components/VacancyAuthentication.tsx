
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const VacancyAuthentication: React.FC = () => {
  const [cedula, setCedula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const { verifyIdentity, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { cedula: targetCedula } = useParams<{ cedula: string }>();

  // Si es administrador, redirigir directamente sin verificación
  React.useEffect(() => {
    if (isAdmin && targetCedula) {
      navigate(`/municipality-selection/${targetCedula}`);
    }
  }, [isAdmin, targetCedula, navigate]);

  const handleVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const isAuthorized = verifyIdentity(cedula);
      
      if (isAuthorized && cedula === targetCedula) {
        toast.success('Verificación exitosa');
        navigate(`/municipality-selection/${targetCedula}`);
      } else {
        toast.error('No está autorizado para seleccionar esta plaza');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Error en la verificación');
      console.error('Verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/dashboard');
  };

  // Si es administrador, no mostrar el diálogo
  if (isAdmin) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" onInteractOutside={handleClose}>
        <DialogHeader>
          <DialogTitle className="text-center">Verificación de Identidad</DialogTitle>
          <DialogDescription className="text-center">
            Por favor, ingrese su número de cédula para verificar su identidad
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleVerification} className="space-y-4 py-4">
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
              autoComplete="off"
            />
          </div>
        </form>
        
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="outline" 
            onClick={handleClose}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleVerification}
            disabled={isLoading}
            className="bg-aeronautica hover:bg-aeronautica-light"
          >
            {isLoading ? 'Verificando...' : 'Verificar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VacancyAuthentication;
