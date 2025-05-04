
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { updatePlazaDeseada } from '@/lib/vacancies';
import { getAvailablePlazaByPriority, recalculateAllPlacements, Prioridad } from '@/lib/prioridades';
import { PriorityMunicipality } from './types';

export const useSaveSelection = (
  municipalitiesWithPriority: PriorityMunicipality[],
  aspirantePuesto: number,
  cedula: string | undefined,
  isAdmin: boolean = false
) => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  // Optimizar el guardado de selección para evitar congelamientos
  const handleSaveSelection = useCallback(async () => {
    if (!cedula) {
      toast.error("No se ha identificado al aspirante");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const priorities: Prioridad[] = municipalitiesWithPriority
        .filter(item => item.prioridad > 0)
        .map(item => ({ municipio: item.municipio, prioridad: item.prioridad }));
      
      if (priorities.length === 0 && !isAdmin) {
        toast.error('Debe seleccionar al menos una plaza');
        setIsSaving(false);
        return;
      }
      
      console.log(`Guardando selección de ${priorities.length} prioridades para aspirante ${cedula}`);
      
      // 1. Guardar en localStorage como fallback (operación rápida)
      localStorage.setItem(`prioridades_${cedula}`, JSON.stringify(priorities));
      
      // 2. Preparar objeto para guardar en Supabase
      const prioridadesSupabase = priorities.map(p => ({
        aspirante_id: cedula,
        municipio: p.municipio,
        prioridad: p.prioridad
      }));
      
      // 3. Eliminar prioridades existentes
      const { error: deleteError } = await supabase
        .from('prioridades')
        .delete()
        .eq('aspirante_id', cedula);
      
      if (deleteError) {
        console.error("Error al eliminar prioridades existentes:", deleteError);
        toast.error("Error al eliminar prioridades existentes");
        setIsSaving(false);
        return;
      }
      
      // 4. Insertar nuevas prioridades (solo si hay alguna)
      if (prioridadesSupabase.length > 0) {
        const { error: insertError } = await supabase
          .from('prioridades')
          .insert(prioridadesSupabase);
        
        if (insertError) {
          console.error("Error al guardar prioridades en Supabase:", insertError);
          toast.error("Error al guardar prioridades en la base de datos");
          setIsSaving(false);
          return;
        }
      }
      
      // Si es administrador y no seleccionó plazas, simplemente redirigir sin asignar
      if (priorities.length === 0 && isAdmin) {
        toast.success('Guardado realizado correctamente');
        navigate('/dashboard');
        setIsSaving(false);
        return;
      }
      
      // 5. Recalcular todas las asignaciones de plazas
      await recalculateAllPlacements();
      
      toast.success('Selección guardada correctamente');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      toast.error("Error al guardar la selección");
    } finally {
      setIsSaving(false);
    }
  }, [municipalitiesWithPriority, aspirantePuesto, cedula, navigate, isAdmin]);

  return {
    isSaving,
    handleSaveSelection
  };
};
