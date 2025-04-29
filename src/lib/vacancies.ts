
import { aspirantes } from './aspirantes';
import { saveToLocalStorage } from './storage';
import { cascadePlazaUpdates, reasignarSiguientePrioridad } from './prioridades';
import { plazas } from './plazas';

// Update aspirante's plaza deseada and handle cascading changes
export const updatePlazaDeseada = (cedula: string, plaza: string): boolean => {
  // Encontrar el aspirante actual
  const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
  if (aspiranteIndex < 0) return false;
  
  const aspirante = aspirantes[aspiranteIndex];
  const antiguaPlaza = aspirante.plazaDeseada;
  
  // Actualizar la plaza del aspirante actual
  aspirantes[aspiranteIndex].plazaDeseada = plaza;
  
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
export const updateAllPlazasDeseadas = (): boolean => {
  // Limpiar la plaza deseada de todos los aspirantes
  aspirantes.forEach(aspirante => {
    aspirante.plazaDeseada = '';
  });
  
  // Limpiar todas las prioridades guardadas en localStorage
  aspirantes.forEach(aspirante => {
    localStorage.removeItem(`prioridades_${aspirante.cedula}`);
  });
  
  // Guardar los cambios en localStorage
  saveToLocalStorage();
  return true;
};
