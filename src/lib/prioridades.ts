import { aspirantes } from './aspirantes';
import { plazas } from './plazas';
import { Aspirante } from './types';
import { supabase } from '@/integrations/supabase/client';

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
  // Si no hay prioridades, devolver null.
  if (!prioridades || prioridades.length === 0) return null;
  
  const plazaCount = new Map<string, number>()
  aspirantes.forEach(a => {
    if(a.plazaDeseada && a.puesto < aspirantePuesto){
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
    const vacantes = plazas.find(p => p.municipio === prioridad.municipio)?.vacantes;
    if (!vacantes) continue;
    if (!plazaCount.has(prioridad.municipio)) {
      return prioridad.municipio;
    }    
    if (plazaCount.get(prioridad.municipio)! < vacantes){
      return prioridad.municipio;
    }
  }
  return null;
};

// Función para reordenar todas las asignaciones de plazas después de cambios
export const recalculateAllPlacements = async () => {
  const plazasMap = new Map(plazas.map(p => [p.municipio, p.vacantes]));
  const plazaOccupation = new Map<string, number>();
  console.log("Recalculando todas las asignaciones de plazas...");
  
  try {
    // Primero, ordenar aspirantes por puesto (menor número = mayor prioridad)
    const sortedAspirantes = [...aspirantes].sort((a, b) => a.puesto - b.puesto);    
    
    // Mapa para llevar el conteo de ocupación de plazas
    const { data: allPrioridades, error: allPrioridadesError } = await supabase
    .from('prioridades')
    .select('aspirante_id, municipio, prioridad')
    .order('prioridad', { ascending: true });
    
    if (allPrioridadesError) throw allPrioridadesError;

    const prioridadesMap = new Map<string,Prioridad[]>()
    allPrioridades.forEach((prioridad) => {
      if (!prioridadesMap.has(prioridad.aspirante_id)) {
        prioridadesMap.set(prioridad.aspirante_id, []);
      }
      prioridadesMap.get(prioridad.aspirante_id)?.push({municipio: prioridad.municipio, prioridad: prioridad.prioridad});
    })
    // Recorrer aspirantes en orden de prioridad
    for (const aspirante of sortedAspirantes) {
      console.log(`Procesando aspirante: ${aspirante.nombre} (Puesto: ${aspirante.puesto})`);
            
      let prioridades = prioridadesMap.get(aspirante.cedula)

      if (!prioridades) {
        console.log(`No hay prioridades para ${aspirante.cedula}, continuando...`);
        continue;
      }
      
      // Calcular la plaza disponible según prioridades
      const nuevaPlaza = getAvailablePlazaByPriority(prioridades, aspirante.puesto);
      
      if (nuevaPlaza){
        console.log(`Asignando plaza: ${nuevaPlaza} a ${aspirante.nombre}`);
        aspirante.plazaDeseada = nuevaPlaza;
        plazaOccupation.set(nuevaPlaza, (plazaOccupation.get(nuevaPlaza) || 0) +1);
      } else {
        console.log(`No hay plazas disponibles para ${aspirante.nombre} según sus prioridades`);
        if (aspirante.plazaDeseada) {
          aspirante.plazaDeseada = "";
        }
      }        
    }
    
    const updates = sortedAspirantes.map((aspirante) => ({
        cedula: aspirante.cedula,
        nombre: aspirante.nombre,
        puesto: aspirante.puesto,
        plaza_deseada: aspirante.plazaDeseada,
      }));

    console.log("Contenido del array updates:", updates);
    const { error: updateError } = await supabase.from('aspirantes').upsert(updates);
    if (updateError) {
      console.error("Error al actualizar plazas en la base de datos:", updateError);
    }else{
      console.log("Recalculación de plazas completada");
      return true;
    }
  } catch (error) {
    console.error("Error durante la recalculación de plazas:", error);
    return false;
  }
};
