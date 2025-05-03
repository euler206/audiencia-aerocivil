
import { aspirantes } from './aspirantes';
import { plazas } from './plazas';

// Tipo para representar una prioridad
interface Prioridad {
  municipio: string;
  prioridad: number;
}

// Función para obtener la plaza disponible según las prioridades
export const getAvailablePlazaByPriority = (
  prioridades: Prioridad[],
  aspirantePuesto: number
): string | null => {
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
