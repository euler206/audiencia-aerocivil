
import { plazas } from './plazas';
import { aspirantes } from './aspirantes';
import { saveToLocalStorage } from './storage';
import { isPlazaAvailable } from './plazas';
import { Aspirante } from './types';

// Get available plaza based on priorities
export const getAvailablePlazaByPriority = (
  priorities: { municipio: string, prioridad: number }[],
  aspirantePuesto: number
): string => {
  // Sort priorities by priority number
  const sortedPriorities = [...priorities].sort((a, b) => a.prioridad - b.prioridad);
  
  // Find the first available plaza
  for (const priority of sortedPriorities) {
    if (isPlazaAvailable(priority.municipio, aspirantePuesto, aspirantes)) {
      return priority.municipio;
    }
  }
  
  // If no plaza is available, return empty string
  return "";
};

// Función para reasignar a un aspirante a su siguiente plaza prioritaria disponible
export const reasignarSiguientePrioridad = (aspirante: Aspirante): void => {
  // Si el aspirante no tiene plaza asignada, no hacer nada
  if (!aspirante.plazaDeseada) return;
  
  // Buscar las prioridades del aspirante almacenadas en localStorage
  const prioridadesString = localStorage.getItem(`prioridades_${aspirante.cedula}`);
  if (!prioridadesString) {
    // Si no hay prioridades guardadas, simplemente quitar la plaza
    const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
    if (index >= 0) {
      aspirantes[index].plazaDeseada = '';
    }
    return;
  }
  
  // Convertir el string de prioridades a un array
  const prioridades: { municipio: string, prioridad: number }[] = JSON.parse(prioridadesString);
  
  // Ordenar prioridades
  prioridades.sort((a, b) => a.prioridad - b.prioridad);
  
  // Buscar la siguiente plaza disponible según las prioridades
  for (const prioridad of prioridades) {
    const plazaObj = plazas.find(p => p.municipio === prioridad.municipio);
    if (!plazaObj) continue;
    
    // Verificar disponibilidad considerando sólo aspirantes con mejor puesto
    const aspirantesConMejorPuesto = aspirantes.filter(
      a => a.plazaDeseada === prioridad.municipio && a.puesto < aspirante.puesto
    ).length;
    
    if (aspirantesConMejorPuesto < plazaObj.vacantes) {
      // La plaza está disponible, asignarla
      const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
      if (index >= 0) {
        const plazaAnterior = aspirantes[index].plazaDeseada;
        aspirantes[index].plazaDeseada = prioridad.municipio;
        
        // Verificar si este cambio afecta a otros aspirantes
        if (plazaAnterior !== prioridad.municipio) {
          cascadePlazaUpdates(aspirante.puesto, prioridad.municipio);
        }
        
        return;
      }
    }
  }
  
  // Si no se encontró ninguna plaza disponible, quitar la asignación
  const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
  if (index >= 0) {
    aspirantes[index].plazaDeseada = '';
  }
};

// Función para actualizar en cascada las plazas cuando hay conflictos de prioridad
export const cascadePlazaUpdates = (puestoOriginal: number, plazaNueva: string) => {
  // Encontrar todos los aspirantes que tienen la misma plaza y están en puestos inferiores
  const aspirantesAfectados = aspirantes
    .filter(a => a.plazaDeseada === plazaNueva && a.puesto > puestoOriginal)
    .sort((a, b) => a.puesto - b.puesto); // Ordenar por puesto (ascendente)
  
  if (aspirantesAfectados.length === 0) return;
  
  // Encontrar cuántos aspirantes hay seleccionados para la plaza nueva
  const plazaSeleccionada = plazas.find(p => p.municipio === plazaNueva);
  if (!plazaSeleccionada) return;
  
  // Contar cuántos aspirantes con mejor puesto ya seleccionaron esta plaza
  const aspirantesConMejorPuesto = aspirantes.filter(
    a => a.plazaDeseada === plazaNueva && a.puesto <= puestoOriginal
  ).length;
  
  // Si hay más aspirantes con mejor puesto que vacantes, reasignar a los aspirantes afectados
  if (aspirantesConMejorPuesto >= plazaSeleccionada.vacantes) {
    for (const aspiranteAfectado of aspirantesAfectados) {
      // Buscar sus prioridades
      reasignarSiguientePrioridad(aspiranteAfectado);
    }
  }
};
