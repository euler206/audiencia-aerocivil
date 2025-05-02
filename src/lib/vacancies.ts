
import { aspirantes } from './aspirantes';
import { saveToLocalStorage } from './storage';
import { cascadePlazaUpdates, reasignarSiguientePrioridad, verificarAspirantesInteresados } from './prioridades';
import { plazas } from './plazas';
import { supabase } from '@/integrations/supabase/client';

// Update aspirante's plaza deseada and handle cascading changes
export const updatePlazaDeseada = async (cedula: string, plaza: string): Promise<boolean> => {
  console.log(`Iniciando actualización de plaza para aspirante ${cedula} a ${plaza}`);
  
  // Encontrar el aspirante actual
  const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
  if (aspiranteIndex < 0) {
    console.error(`No se encontró el aspirante con cédula ${cedula}`);
    return false;
  }
  
  const aspirante = aspirantes[aspiranteIndex];
  const antiguaPlaza = aspirante.plazaDeseada;
  
  console.log(`Aspirante ${cedula} (puesto ${aspirante.puesto}): cambiando de ${antiguaPlaza || 'ninguna'} a ${plaza || 'ninguna'}`);
  
  // Actualizar la plaza del aspirante actual
  aspirantes[aspiranteIndex].plazaDeseada = plaza;
  
  // Try to update in Supabase
  try {
    console.log(`Actualizando aspirante ${cedula} con plaza ${plaza} en Supabase`);
    const { error } = await supabase
      .from('aspirantes')
      .update({ plaza_deseada: plaza })
      .eq('cedula', cedula);
      
    if (error) {
      console.error(`Error al actualizar aspirante ${cedula} en Supabase:`, error);
    } else {
      console.log(`Aspirante ${cedula} actualizado correctamente en Supabase`);
    }
  } catch (error) {
    console.error("Error al actualizar en Supabase:", error);
  }
  
  // Si ya existía una selección previa y es diferente, verificar si se liberó una plaza
  if (antiguaPlaza !== plaza) {
    console.log(`Cambio de plaza detectado: de ${antiguaPlaza || 'ninguna'} a ${plaza || 'ninguna'}`);
    
    // Si había una plaza anterior, verificar si alguien más puede tomarla ahora
    if (antiguaPlaza !== '') {
      console.log(`Plaza liberada: ${antiguaPlaza}. Verificando si otro aspirante la prefiere...`);
      await verificarAspirantesInteresados(antiguaPlaza);
    }
    
    // Si seleccionó una nueva plaza, realizar actualización en cascada
    if (plaza !== '') {
      console.log(`Nueva plaza seleccionada: ${plaza}. Verificando posibles conflictos...`);
      await cascadePlazaUpdates(aspirante.puesto, plaza);
    }
  }
  
  await saveToLocalStorage();
  return true;
};

// Función para limpiar todas las plazas deseadas
export const updateAllPlazasDeseadas = async (): Promise<boolean> => {
  console.log("Limpiando todas las plazas deseadas");
  
  try {
    // Primero intentar actualizar en Supabase
    console.log("Actualizando todas las plazas en Supabase a vacío");
    const { error } = await supabase
      .from('aspirantes')
      .update({ plaza_deseada: null })
      .neq('cedula', 'no-existe'); // Esto afecta a todos los registros
      
    if (error) {
      console.error("Error al actualizar aspirantes en Supabase:", error);
      return false;
    }
    
    console.log("Actualización en Supabase completada correctamente");
    
    // Actualizar localmente
    console.log("Actualizando aspirantes locales");
    for (let i = 0; i < aspirantes.length; i++) {
      aspirantes[i].plazaDeseada = '';
    }
    
    // Limpiar todas las prioridades guardadas en localStorage
    console.log("Limpiando prioridades en localStorage");
    aspirantes.forEach(aspirante => {
      localStorage.removeItem(`prioridades_${aspirante.cedula}`);
    });
    
    // Guardar los cambios actualizados en localStorage
    await saveToLocalStorage();
    
    console.log("Proceso de limpieza completado correctamente");
    return true;
  } catch (error) {
    console.error("Error durante el proceso de limpieza:", error);
    return false;
  }
};
