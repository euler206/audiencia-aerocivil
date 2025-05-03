
import { supabase } from '@/integrations/supabase/client';
import { aspirantes } from './aspirantes';
import { loadFromLocalStorage } from './storage';

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
