
import { supabase } from '@/integrations/supabase/client';
import { aspirantes } from './aspirantes';
import { loadFromLocalStorage } from './storage';
import { recalculateAllPlacements } from './prioridades';

// Función para actualizar la plaza deseada de un aspirante específico
export const updatePlazaDeseada = async (cedula: string, plazaDeseada: string): Promise<boolean> => {
  try {
    console.log(`Actualizando plaza deseada para aspirante ${cedula} a: ${plazaDeseada}`);
    
    // Actualizar primero en Supabase para evitar bloqueo de UI
    const { error } = await supabase
      .from('aspirantes')
      .update({ plaza_deseada: plazaDeseada })
      .eq('cedula', cedula);
      
    if (error) {
      console.error("Error al actualizar plaza deseada en Supabase:", error);
      return false;
    }
    
    // Luego actualizar en el array local de aspirantes
    const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
    if (aspiranteIndex >= 0) {
      // Guardar la plaza anterior para verificar si se liberó
      const plazaAnterior = aspirantes[aspiranteIndex].plazaDeseada;
      aspirantes[aspiranteIndex].plazaDeseada = plazaDeseada;
      
      // Si la plaza anterior es diferente a la nueva, recalcular todas las asignaciones
      if (plazaAnterior && plazaAnterior !== plazaDeseada) {
        console.log(`Plaza liberada: ${plazaAnterior}. Recalculando asignaciones...`);
        await recalculateAllPlacements();
      }
    } else {
      console.error(`No se encontró el aspirante con cédula: ${cedula}`);
      return false;
    }
    
    console.log(`Plaza deseada actualizada exitosamente para aspirante ${cedula}`);
    return true;
  } catch (error) {
    console.error("Error al actualizar plaza deseada:", error);
    return false;
  }
};

// Función para actualizar todas las plazas deseadas desde Supabase
export const updateAllPlazasDeseadas = async (): Promise<boolean> => {
  try {
    console.log("Actualizando todas las plazas deseadas...");
    
    // Obtener directamente los datos desde Supabase en vez de manipular el array local
    const { data: supabaseAspirantes, error } = await supabase
      .from('aspirantes')
      .select('cedula, plaza_deseada');
      
    if (error) {
      console.error("Error al obtener datos de Supabase:", error);
      return false;
    }
    
    // Actualizar el array local con los datos de Supabase de manera más eficiente
    if (supabaseAspirantes) {
      // Crear un mapa para búsqueda rápida por cédula
      const plazasMap = new Map();
      supabaseAspirantes.forEach(a => {
        plazasMap.set(a.cedula, a.plaza_deseada || "");
      });
      
      // Actualizar solo las plazas que han cambiado
      for (const aspirante of aspirantes) {
        if (plazasMap.has(aspirante.cedula)) {
          aspirante.plazaDeseada = plazasMap.get(aspirante.cedula);
        }
      }
    }
    
    console.log("Plazas deseadas actualizadas correctamente");
    return true;
  } catch (error) {
    console.error("Error al actualizar plazas deseadas:", error);
    return false;
  }
};

// Función para limpiar todas las selecciones
export const clearAllSelections = async (): Promise<boolean> => {
  try {
    console.log("Limpiando todas las selecciones de plazas...");
    
    // 1. Actualizar en Supabase: limpiar plazas deseadas
    const { error: updateError } = await supabase
      .from('aspirantes')
      .update({ plaza_deseada: null });
      
    if (updateError) {
      console.error("Error al limpiar plazas en Supabase:", updateError);
      return false;
    }
    
    // 2. Eliminar todas las prioridades
    const { error: deleteError } = await supabase
      .from('prioridades')
      .delete();
      
    if (deleteError) {
      console.error("Error al eliminar prioridades en Supabase:", deleteError);
      return false;
    }
    
    // 3. Actualizar aspirantes locales
    for (const aspirante of aspirantes) {
      aspirante.plazaDeseada = "";
    }
    
    // 4. Limpiar localStorage de prioridades
    for (const aspirante of aspirantes) {
      localStorage.removeItem(`prioridades_${aspirante.cedula}`);
    }
    
    console.log("Todas las selecciones han sido limpiadas correctamente");
    return true;
  } catch (error) {
    console.error("Error al limpiar todas las selecciones:", error);
    return false;
  }
};
