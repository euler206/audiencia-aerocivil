
import { supabase } from '@/integrations/supabase/client';
import { aspirantes } from './aspirantes';
import { loadFromLocalStorage } from './storage';

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
      aspirantes[aspiranteIndex].plazaDeseada = plazaDeseada;
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
