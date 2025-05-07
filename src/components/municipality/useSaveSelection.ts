
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { PriorityMunicipality } from './types';
import { Progress } from '@/components/ui/progress';

export const useSaveSelection = (
  municipalitiesWithPriority: PriorityMunicipality[],
  aspirantePuesto: number,
  cedula: string | undefined,
  isAdmin: boolean = false
) => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  
  // Optimized save selection function to reduce processing time
  const handleSaveSelection = useCallback(async () => {
    if (!cedula) {
      toast.error("No se ha identificado al aspirante");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Filter and sort priorities once to improve performance
      const priorities = municipalitiesWithPriority
        .filter(item => item.prioridad > 0)
        .sort((a, b) => a.prioridad - b.prioridad)
        .map(item => ({ municipio: item.municipio, prioridad: item.prioridad }));
      
      if (priorities.length === 0 && !isAdmin) {
        toast.error('Debe seleccionar al menos una plaza');
        setIsSaving(false);
        return;
      }
      
      console.log(`Guardando selección de ${priorities.length} prioridades para aspirante ${cedula}`);
      
      // Use localStorage as backup only if needed
      localStorage.setItem(`prioridades_${cedula}`, JSON.stringify(priorities));
      
      // Batch operations to reduce database calls
      const batchPromises = [];
      
      // 1. Delete existing priorities - add to batch
      batchPromises.push(
        supabase
          .from('prioridades')
          .delete()
          .eq('aspirante_id', cedula)
      );
      
      // 2. Insert new priorities if any exist - add to batch
      if (priorities.length > 0) {
        const prioridadesSupabase = priorities.map(p => ({
          aspirante_id: cedula,
          municipio: p.municipio,
          prioridad: p.prioridad
        }));
        
        batchPromises.push(
          supabase
            .from('prioridades')
            .insert(prioridadesSupabase)
        );
      }
      
      // Execute both operations concurrently
      const results = await Promise.all(batchPromises);
      
      // Check for errors in batch operations
      for (let i = 0; i < results.length; i++) {
        if (results[i].error) {
          console.error(`Error in batch operation ${i}:`, results[i].error);
          throw new Error(`Error in database operation: ${results[i].error.message}`);
        }
      }
      
      // If admin and no priorities, just return to dashboard
      if (priorities.length === 0 && isAdmin) {
        toast.success('Guardado realizado correctamente');
        navigate('/dashboard');
        setIsSaving(false);
        return;
      }
      
      // Use optimized recalculation function
      await recalculatePlacementsOptimized(cedula, aspirantePuesto);
      
      toast.success('Selección guardada correctamente');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      toast.error("Error al guardar la selección");
    } finally {
      setIsSaving(false);
    }
  }, [municipalitiesWithPriority, aspirantePuesto, cedula, navigate, isAdmin]);
  
  // Optimized recalculation function that processes in smaller batches
  const recalculatePlacementsOptimized = async (currentCedula: string, currentPuesto: number) => {
    try {
      console.log("Iniciando recálculo optimizado de asignaciones...");
      
      // 1. Fetch only relevant data - aspirantes with better puesto than current
      const { data: relevantAspirantesData, error: aspirantesError } = await supabase
        .from('aspirantes')
        .select('cedula, puesto, nombre')
        .order('puesto', { ascending: true });
        
      if (aspirantesError) {
        throw new Error(`Error fetching aspirantes: ${aspirantesError.message}`);
      }
      
      // 2. Fetch plazas data once
      const { data: plazasData, error: plazasError } = await supabase
        .from('plazas')
        .select('municipio, vacantes');
        
      if (plazasError) {
        throw new Error(`Error fetching plazas: ${plazasError.message}`);
      }
      
      // Create efficient maps for lookups
      const plazasMap = new Map(plazasData.map(p => [p.municipio, p.vacantes]));
      const plazaOccupation = new Map();
      
      // Process aspirantes in batches to avoid overwhelming the database
      const BATCH_SIZE = 10;
      const aspirantes = relevantAspirantesData || [];
      
      for (let i = 0; i < aspirantes.length; i += BATCH_SIZE) {
        const batch = aspirantes.slice(i, i + BATCH_SIZE);
        await processBatch(batch, plazasMap, plazaOccupation, i / aspirantes.length);
      }
      
      console.log("Recálculo optimizado completado exitosamente");
      return true;
    } catch (error) {
      console.error("Error durante el recálculo optimizado:", error);
      return false;
    }
  };

  const processBatch = async (aspirantesBatch: any[], plazasMap: Map<string, number>, plazaOccupation: Map<string, number>, progress: number) => {
    const updateBatch = [];
    
    for (const aspirante of aspirantesBatch) {
      // Get priorities for this aspirante
      const { data: prioridadesData } = await supabase
        .from('prioridades')
        .select('municipio, prioridad')
        .eq('aspirante_id', aspirante.cedula)
        .order('prioridad', { ascending: true });
      
      if (!prioridadesData || prioridadesData.length === 0) {
        continue; // Skip if no priorities
      }
      
      // Find available plaza based on current occupations
      let nuevaPlaza = null;
      for (const prioridad of prioridadesData) {
        const vacantes = plazasMap.get(prioridad.municipio) || 0;
        const ocupadas = plazaOccupation.get(prioridad.municipio) || 0;
        
        if (ocupadas < vacantes) {
          nuevaPlaza = prioridad.municipio;
          // Update occupation count
          plazaOccupation.set(nuevaPlaza, ocupadas + 1);
          break;
        }
      }
      
      // Prepare update operation
      updateBatch.push({
        cedula: aspirante.cedula,
        plaza_deseada: nuevaPlaza || null
      });
    }
    
    // Batch update plaza assignments
    if (updateBatch.length > 0) {
      // Use UPSERT to handle all updates in one call
      for (const update of updateBatch) {
        await supabase
          .from('aspirantes')
          .update({ plaza_deseada: update.plaza_deseada })
          .eq('cedula', update.cedula);
      }
    }
  };

  return {
    isSaving,
    handleSaveSelection
  };
};
