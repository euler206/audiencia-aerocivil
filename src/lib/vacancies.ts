
import { supabase } from '@/integrations/supabase/client';
import { aspirantes } from './aspirantes';
import { loadFromLocalStorage } from './storage';

// Función para actualizar la plaza deseada de un aspirante específico
export const updatePlazaDeseada = async (cedula: string, plazaDeseada: string): Promise<boolean> => {
  try {
    console.log(`Actualizando plaza deseada para aspirante ${cedula} a: ${plazaDeseada}`);
    
    // Actualizar en el array local de aspirantes
    const aspirante = aspirantes.find(a => a.cedula === cedula);
    if (aspirante) {
      aspirante.plazaDeseada = plazaDeseada;
    } else {
      console.error(`No se encontró el aspirante con cédula: ${cedula}`);
      return false;
    }
    
    // Actualizar en Supabase
    const { error } = await supabase
      .from('aspirantes')
      .update({ plaza_deseada: plazaDeseada })
      .eq('cedula', cedula);
      
    if (error) {
      console.error("Error al actualizar plaza deseada en Supabase:", error);
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
    
    // 1. Actualizar todos los aspirantes en el array local
    for (const aspirante of aspirantes) {
      aspirante.plazaDeseada = "";
    }
    
    // 2. Recargar datos desde Supabase
    await loadFromLocalStorage();
    
    console.log("Plazas deseadas actualizadas correctamente");
    return true;
  } catch (error) {
    console.error("Error al actualizar plazas deseadas:", error);
    return false;
  }
};
