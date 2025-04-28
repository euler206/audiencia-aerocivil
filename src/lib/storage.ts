
import { plazas } from './plazas';
import { aspirantes } from './aspirantes';

// Helper function to save data to local storage
export const saveToLocalStorage = () => {
  localStorage.setItem('plazas', JSON.stringify(plazas));
  localStorage.setItem('aspirantes', JSON.stringify(aspirantes));
};

// Helper function to load data from local storage
export const loadFromLocalStorage = () => {
  const plazasData = localStorage.getItem('plazas');
  const aspirantesData = localStorage.getItem('aspirantes');
  
  if (plazasData) {
    const parsedPlazas = JSON.parse(plazasData);
    plazas.splice(0, plazas.length, ...parsedPlazas);
  }
  
  if (aspirantesData) {
    const parsedAspirantes = JSON.parse(aspirantesData);
    aspirantes.splice(0, aspirantes.length, ...parsedAspirantes);
  }
};

// Initialize storage on first load
export const initializeStorage = () => {
  if (!localStorage.getItem('plazas') || !localStorage.getItem('aspirantes')) {
    saveToLocalStorage();
  } else {
    loadFromLocalStorage();
  }
};
