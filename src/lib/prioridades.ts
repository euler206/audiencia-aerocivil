
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
  // Ordenar prioridades por nivel de prioridad (menor número = mayor prioridad)
  const sortedPrioridades = [...prioridades].sort((a, b) => a.prioridad - b.prioridad);
  
  // Verificar cada prioridad en orden
  for (const prioridad of sortedPrioridades) {
    // Encontrar la plaza correspondiente
    const plaza = plazas.find(p => p.municipio === prioridad.municipio);
    
    if (!plaza) continue; // Si no se encuentra la plaza, pasar a la siguiente
    
    // Contar cuántos aspirantes con mejor puesto ya seleccionaron esta plaza
    const selectedByBetter = aspirantes.filter(
      a => a.plazaDeseada === prioridad.municipio && a.puesto < aspirantePuesto
    ).length;
    
    // Si hay vacantes disponibles, devolver esta plaza
    if (selectedByBetter < plaza.vacantes) {
      return prioridad.municipio;
    }
  }
  
  // Si ninguna de las plazas priorizadas está disponible, devolver null
  return null;
};
