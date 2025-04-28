
import { aspirantes } from './aspirantes';
import { saveToLocalStorage } from './storage';
import { cascadePlazaUpdates } from './prioridades';

// Update aspirante's plaza deseada and handle cascading changes
export const updatePlazaDeseada = (cedula: string, plaza: string): boolean => {
  // Encontrar el aspirante actual
  const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
  if (aspiranteIndex < 0) return false;
  
  const aspirante = aspirantes[aspiranteIndex];
  const antiguaPlaza = aspirante.plazaDeseada;
  
  // Actualizar la plaza del aspirante actual
  aspirantes[aspiranteIndex].plazaDeseada = plaza;
  
  // Si ya existía una selección previa, realizar actualización en cascada
  if (antiguaPlaza !== plaza && plaza !== '') {
    cascadePlazaUpdates(aspirante.puesto, plaza);
  }
  
  saveToLocalStorage();
  return true;
};

// Nueva función para limpiar todas las plazas deseadas
export const updateAllPlazasDeseadas = (): boolean => {
  // Limpiar la plaza deseada de todos los aspirantes
  aspirantes.forEach(aspirante => {
    aspirante.plazaDeseada = '';
  });
  
  // Guardar los cambios en localStorage
  saveToLocalStorage();
  return true;
};
