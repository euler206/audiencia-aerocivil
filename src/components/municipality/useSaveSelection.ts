
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { updatePlazaDeseada } from '@/lib/vacancies';
import { getAvailablePlazaByPriority } from '@/lib';
import { PriorityMunicipality, Priority } from './types';

export const useSaveSelection = (
  municipalitiesWithPriority: PriorityMunicipality[],
  aspirantePuesto: number,
  cedula: string | undefined
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
      const priorities: Priority[] = municipalitiesWithPriority
        .filter(item => item.prioridad > 0)
        .map(item => ({ municipio: item.municipio, prioridad: item.prioridad }));
      
      if (priorities.length === 0) {
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
      
      // 4. Insertar nuevas prioridades
      const { error: insertError } = await supabase
        .from('prioridades')
        .insert(prioridadesSupabase);
      
      if (insertError) {
        console.error("Error al guardar prioridades en Supabase:", insertError);
        toast.error("Error al guardar prioridades en la base de datos");
        setIsSaving(false);
        return;
      }
      
      // 5. Calcular plaza disponible (usando función optimizada)
      const selectedPlaza = getAvailablePlazaByPriority(priorities, aspirantePuesto);
      
      if (!selectedPlaza) {
        toast.error('No hay plazas disponibles según sus prioridades');
        setIsSaving(false);
        return;
      }
      
      // 6. Actualizar plaza deseada (operación optimizada)
      const success = await updatePlazaDeseada(cedula, selectedPlaza);
      
      if (success) {
        toast.success(`Plaza asignada: ${selectedPlaza}`);
        navigate('/dashboard');
      } else {
        toast.error('Error al asignar la plaza');
      }
      
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      toast.error("Error al guardar la selección");
    } finally {
      setIsSaving(false);
    }
  }, [municipalitiesWithPriority, aspirantePuesto, cedula, navigate]);

  return {
    isSaving,
    handleSaveSelection
  };
};
