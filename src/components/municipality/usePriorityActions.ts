
import { useCallback } from 'react';
import { toast } from 'sonner';
import { PriorityMunicipality } from './types';

export const usePriorityActions = (
  municipalitiesWithPriority: PriorityMunicipality[],
  setMunicipalitiesWithPriority: React.Dispatch<React.SetStateAction<PriorityMunicipality[]>>,
  maxPrioridades: number
) => {
  // Manejar la asignación de prioridad a un municipio
  const handleSetPriority = useCallback((municipio: string) => {
    setMunicipalitiesWithPriority(prev => {
      // Copiar el estado previo para modificarlo
      const newState = [...prev];
      const itemIndex = newState.findIndex(item => item.municipio === municipio);
      
      if (itemIndex === -1) return prev;
      
      const item = newState[itemIndex];
      
      // Si ya tiene prioridad, quitársela
      if (item.prioridad > 0) {
        // Al quitar una prioridad, debemos reajustar todas las prioridades
        const oldPriority = item.prioridad;
        item.prioridad = 0;
        
        // Reajustar todas las prioridades mayores que la que quitamos
        newState.forEach(m => {
          if (m.prioridad > oldPriority) {
            m.prioridad -= 1;
          }
        });
        return newState;
      }
      
      // Si no tiene prioridad, verificar si podemos asignar una nueva
      const existingPriorities = newState.filter(item => item.prioridad > 0).length;
      
      if (existingPriorities < maxPrioridades) {
        // Asignarle la siguiente prioridad disponible
        item.prioridad = existingPriorities + 1;
        return newState;
      }
      
      // Si ya alcanzamos el máximo de prioridades, mostrar mensaje
      toast.error(`Solo puede seleccionar ${maxPrioridades} prioridades según su puesto`);
      return prev;
    });
  }, [maxPrioridades, setMunicipalitiesWithPriority]);

  // Función para restablecer todas las prioridades
  const handleReset = useCallback(() => {
    setMunicipalitiesWithPriority(prev => 
      prev.map(item => ({ ...item, prioridad: 0 }))
    );
    
    toast.info("Se han reiniciado todas las prioridades");
  }, [setMunicipalitiesWithPriority]);

  return {
    handleSetPriority,
    handleReset
  };
};
