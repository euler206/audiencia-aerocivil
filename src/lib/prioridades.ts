
import { aspirantes } from './aspirantes';
import { plazas } from './plazas';

// Tipo para representar una prioridad
export interface Prioridad {
  municipio: string;
  prioridad: number;
}

// Función para obtener la plaza disponible según las prioridades
export const getAvailablePlazaByPriority = (
  prioridades: Prioridad[],
  aspirantePuesto: number
): string | null => {
  // Si no hay prioridades, devolver null
  if (!prioridades || prioridades.length === 0) return null;

  // Crear un mapa para consulta rápida de plazas
  const plazasMap = new Map(plazas.map(p => [p.municipio, p.vacantes]));
  
  // Crear un mapa para contar aspirantes por plaza
  const plazaCount = new Map<string, number>();
  aspirantes.forEach(a => {
    if (a.plazaDeseada && a.puesto < aspirantePuesto) {
      plazaCount.set(
        a.plazaDeseada, 
        (plazaCount.get(a.plazaDeseada) || 0) + 1
      );
    }
  });
  
  // Ordenar prioridades por nivel de prioridad (menor número = mayor prioridad)
  const sortedPrioridades = [...prioridades].sort((a, b) => a.prioridad - b.prioridad);
  
  // Verificar cada prioridad en orden
  for (const prioridad of sortedPrioridades) {
    const vacantes = plazasMap.get(prioridad.municipio);
    
    if (!vacantes) continue; // Si no se encuentra la plaza, pasar a la siguiente
    
    // Contar cuántos aspirantes con mejor puesto ya seleccionaron esta plaza
    const selectedByBetter = plazaCount.get(prioridad.municipio) || 0;
    
    // Si hay vacantes disponibles, devolver esta plaza
    if (selectedByBetter < vacantes) {
      return prioridad.municipio;
    }
  }
  
  // Si ninguna de las plazas priorizadas está disponible, devolver null
  return null;
};

// Función para reordenar todas las asignaciones de plazas después de cambios
export const recalculateAllPlacements = async () => {
  console.log("Recalculando todas las asignaciones de plazas...");
  
  // Primero, ordenar aspirantes por puesto (menor número = mayor prioridad)
  const sortedAspirantes = [...aspirantes].sort((a, b) => a.puesto - b.puesto);
  
  // Mapa para llevar el conteo de ocupación de plazas
  const plazaOccupation = new Map<string, number>();
  
  // Recorrer aspirantes en orden de prioridad
  for (const aspirante of sortedAspirantes) {
    console.log(`Procesando aspirante: ${aspirante.nombre} (Puesto: ${aspirante.puesto})`);
    
    // Obtener las prioridades del aspirante desde localStorage o base de datos
    const prioridadesString = localStorage.getItem(`prioridades_${aspirante.cedula}`);
    if (!prioridadesString) {
      console.log(`No hay prioridades almacenadas para ${aspirante.cedula}, continuando...`);
      continue; // Si no tiene prioridades, continuar con el siguiente
    }
    
    const prioridades = JSON.parse(prioridadesString);
    if (!prioridades || prioridades.length === 0) {
      console.log(`Prioridades vacías para ${aspirante.cedula}, continuando...`);
      continue;
    }
    
    // Calcular la plaza disponible según prioridades
    const nuevaPlaza = getAvailablePlazaByPriority(prioridades, aspirante.puesto);
    
    if (nuevaPlaza) {
      console.log(`Asignando plaza: ${nuevaPlaza} a ${aspirante.nombre}`);
      
      // Actualizar plazaDeseada en el objeto aspirante
      aspirante.plazaDeseada = nuevaPlaza;
      
      // Incrementar conteo de ocupación
      const currentOccupation = plazaOccupation.get(nuevaPlaza) || 0;
      plazaOccupation.set(nuevaPlaza, currentOccupation + 1);
      
      // Actualizar en base de datos
      try {
        const { error } = await import('@/integrations/supabase/client').then(
          ({ supabase }) => supabase
            .from('aspirantes')
            .update({ plaza_deseada: nuevaPlaza })
            .eq('cedula', aspirante.cedula)
        );
        
        if (error) {
          console.error(`Error al actualizar plaza para ${aspirante.cedula}:`, error);
        }
      } catch (error) {
        console.error(`Error en actualización de base de datos para ${aspirante.cedula}:`, error);
      }
    } else {
      console.log(`No hay plazas disponibles para ${aspirante.nombre} según sus prioridades`);
      
      // Si no hay plaza disponible, borrar su selección actual
      if (aspirante.plazaDeseada) {
        aspirante.plazaDeseada = "";
        
        // Actualizar en base de datos
        try {
          const { error } = await import('@/integrations/supabase/client').then(
            ({ supabase }) => supabase
              .from('aspirantes')
              .update({ plaza_deseada: null })
              .eq('cedula', aspirante.cedula)
          );
          
          if (error) {
            console.error(`Error al limpiar plaza para ${aspirante.cedula}:`, error);
          }
        } catch (error) {
          console.error(`Error en limpieza de plaza para ${aspirante.cedula}:`, error);
        }
      }
    }
  }
  
  console.log("Recalculación de plazas completada");
  return true;
};
