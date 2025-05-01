
import { aspirantes } from './aspirantes';
import { saveToLocalStorage } from './storage';
import { cascadePlazaUpdates, reasignarSiguientePrioridad } from './prioridades';
import { plazas } from './plazas';
import { supabase } from '@/integrations/supabase/client';

// Update aspirante's plaza deseada and handle cascading changes
export const updatePlazaDeseada = async (cedula: string, plaza: string): Promise<boolean> => {
  // Encontrar el aspirante actual
  const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
  if (aspiranteIndex < 0) return false;
  
  const aspirante = aspirantes[aspiranteIndex];
  const antiguaPlaza = aspirante.plazaDeseada;
  
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
    // Si había una plaza anterior, verificar si alguien más puede tomarla ahora
    if (antiguaPlaza !== '') {
      // Buscar aspirantes que podrían preferir esta plaza que fue liberada
      // Ordenarlos por puesto para darle prioridad al mejor posicionado
      const aspirantesAVerificar = [...aspirantes]
        .filter(a => a.cedula !== cedula) // Excluir al aspirante actual
        .sort((a, b) => a.puesto - b.puesto); // Ordenar por puesto (ascendente)
      
      // Verificar si algún aspirante tiene esta plaza como prioritaria
      for (const otroAspirante of aspirantesAVerificar) {
        // Verificar si tiene prioridades guardadas
        const prioridadesString = localStorage.getItem(`prioridades_${otroAspirante.cedula}`);
        if (!prioridadesString) continue;
        
        const prioridades = JSON.parse(prioridadesString);
        // Buscar si la plaza liberada está en sus prioridades y con mayor prioridad que su plaza actual
        const plazaPrioritaria = prioridades.find(
          (p: { municipio: string }) => p.municipio === antiguaPlaza
        );
        
        if (plazaPrioritaria) {
          // Verificar si esta plaza liberada tiene mayor prioridad que la actual del aspirante
          const prioridadPlazaActual = prioridades.find(
            (p: { municipio: string }) => p.municipio === otroAspirante.plazaDeseada
          );
          
          const esMejorPrioridad = !prioridadPlazaActual || 
            plazaPrioritaria.prioridad < prioridadPlazaActual.prioridad;
            
          if (esMejorPrioridad) {
            // Reasignar al aspirante a la plaza liberada que es de mayor prioridad para él
            const index = aspirantes.findIndex(a => a.cedula === otroAspirante.cedula);
            if (index >= 0) {
              const plazaAnteriorOtroAspirante = otroAspirante.plazaDeseada;
              aspirantes[index].plazaDeseada = antiguaPlaza;
              
              // Actualizar en Supabase
              try {
                await supabase
                  .from('aspirantes')
                  .update({ plaza_deseada: antiguaPlaza })
                  .eq('cedula', otroAspirante.cedula);
              } catch (error) {
                console.error(`Error al actualizar aspirante ${otroAspirante.cedula} en Supabase:`, error);
              }
              
              // Si este aspirante tenía una plaza, verificar si alguien más puede tomarla ahora
              if (plazaAnteriorOtroAspirante) {
                // Llamada recursiva para continuar la cadena de reasignaciones
                cascadePlazaUpdates(otroAspirante.puesto, antiguaPlaza);
              }
              
              // Solo procesamos un aspirante a la vez para esta plaza liberada
              break;
            }
          }
        }
      }
    }
    
    // Si seleccionó una nueva plaza, realizar actualización en cascada
    if (plaza !== '') {
      cascadePlazaUpdates(aspirante.puesto, plaza);
    }
  }
  
  saveToLocalStorage();
  return true;
};

// Función para limpiar todas las plazas deseadas
export const updateAllPlazasDeseadas = async (): Promise<boolean> => {
  console.log("Limpiando todas las plazas deseadas");
  
  // Limpiar la plaza deseada de todos los aspirantes
  aspirantes.forEach(aspirante => {
    aspirante.plazaDeseada = '';
  });
  
  // Limpiar todas las prioridades guardadas en localStorage
  aspirantes.forEach(aspirante => {
    localStorage.removeItem(`prioridades_${aspirante.cedula}`);
  });
  
  // Try to update all in Supabase
  try {
    console.log("Limpiando plazas en Supabase");
    const { error } = await supabase
      .from('aspirantes')
      .update({ plaza_deseada: null });
      
    if (error) {
      console.error("Error al limpiar plazas en Supabase:", error);
    } else {
      console.log("Plazas limpiadas correctamente en Supabase");
    }
    
    // Also clear prioridades table
    console.log("Limpiando prioridades en Supabase");
    const { error: prioridadesError } = await supabase
      .from('prioridades')
      .delete()
      .neq('id', 0);
      
    if (prioridadesError) {
      console.error("Error al limpiar prioridades en Supabase:", prioridadesError);
    } else {
      console.log("Prioridades limpiadas correctamente en Supabase");
    }
  } catch (error) {
    console.error("Error al actualizar en Supabase:", error);
  }
  
  // Guardar los cambios en localStorage
  saveToLocalStorage();
  return true;
};
