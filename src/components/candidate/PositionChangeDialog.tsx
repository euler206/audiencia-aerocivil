
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Aspirante } from '@/lib';

interface PositionChangeDialogProps {
  aspirante: Aspirante;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPositionChange: (cedula: string, nuevoPuesto: number) => Promise<void>;
}

const PositionChangeDialog: React.FC<PositionChangeDialogProps> = ({
  aspirante,
  isOpen,
  onOpenChange,
  onPositionChange,
}) => {
  const [nuevaPosicion, setNuevaPosicion] = useState<string>(aspirante.puesto.toString());
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePositionChange = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      
      const posicionNumerica = parseInt(nuevaPosicion.trim());
      
      // Validar que sea un número positivo
      if (isNaN(posicionNumerica) || posicionNumerica <= 0) {
        setError('Por favor, introduzca un número positivo válido');
        return;
      }

      // Llamar a la función para cambiar la posición
      await onPositionChange(aspirante.cedula, posicionNumerica);
      
      // Cerrar el diálogo
      onOpenChange(false);
    } catch (error) {
      console.error('Error al cambiar posición:', error);
      setError('Ocurrió un error al actualizar la posición');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cambiar Posición del Aspirante</DialogTitle>
          <DialogDescription>
            Modifique la posición de {aspirante.nombre}. 
            Posición actual: {aspirante.puesto}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nuevaPosicion" className="text-right">
              Nueva posición
            </Label>
            <Input
              id="nuevaPosicion"
              type="number"
              min="1"
              className="col-span-3"
              value={nuevaPosicion}
              onChange={(e) => setNuevaPosicion(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-500 font-medium">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handlePositionChange} 
            disabled={isProcessing}
            className="bg-aeronautica text-white hover:bg-aeronautica-light"
          >
            {isProcessing ? 'Procesando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PositionChangeDialog;
