
import { plazas } from './plazas';
import { aspirantes } from './aspirantes';
import { supabase } from '@/integrations/supabase/client';

// Helper function to save data to local storage
export const saveToLocalStorage = async () => {
  localStorage.setItem('plazas', JSON.stringify(plazas));
  localStorage.setItem('aspirantes', JSON.stringify(aspirantes));
  
  // We'll also sync to Supabase when possible
  try {
    // For each aspirante that has a plazaDeseada, update it in Supabase
    for (const aspirante of aspirantes) {
      if (aspirante.plazaDeseada) {
        const { error } = await supabase
          .from('aspirantes')
          .update({ plaza_deseada: aspirante.plazaDeseada })
          .eq('cedula', aspirante.cedula);
          
        if (error) {
          console.error(`Error updating aspirante ${aspirante.cedula} in Supabase:`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error syncing to Supabase:", error);
  }
};

// Helper function to load data from local storage or Supabase
export const loadFromLocalStorage = async () => {
  try {
    // Try to load from Supabase first
    const { data: supabaseAspirantes, error: aspirantesError } = await supabase
      .from('aspirantes')
      .select('*');
      
    const { data: supabasePlazas, error: plazasError } = await supabase
      .from('plazas')
      .select('*');
    
    if (!aspirantesError && supabaseAspirantes) {
      // Map Supabase data to our format
      const formattedAspirantes = supabaseAspirantes.map(a => ({
        puesto: a.puesto,
        puntaje: a.puntaje,
        cedula: a.cedula,
        nombre: a.nombre,
        plazaDeseada: a.plaza_deseada || ""
      }));
      
      aspirantes.splice(0, aspirantes.length, ...formattedAspirantes);
    } else {
      // Fallback to localStorage
      const aspirantesData = localStorage.getItem('aspirantes');
      if (aspirantesData) {
        const parsedAspirantes = JSON.parse(aspirantesData);
        aspirantes.splice(0, aspirantes.length, ...parsedAspirantes);
      }
    }
    
    if (!plazasError && supabasePlazas) {
      // Map Supabase data to our format
      const formattedPlazas = supabasePlazas.map(p => ({
        departamento: p.departamento,
        municipio: p.municipio,
        vacantes: p.vacantes
      }));
      
      plazas.splice(0, plazas.length, ...formattedPlazas);
    } else {
      // Fallback to localStorage
      const plazasData = localStorage.getItem('plazas');
      if (plazasData) {
        const parsedPlazas = JSON.parse(plazasData);
        plazas.splice(0, plazas.length, ...parsedPlazas);
      }
    }
  } catch (error) {
    console.error("Error loading data from Supabase:", error);
    
    // Fallback to localStorage if Supabase fails
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
  }
};

// Initialize storage on first load
export const initializeStorage = async () => {
  await loadFromLocalStorage();
  if (!localStorage.getItem('plazas') || !localStorage.getItem('aspirantes')) {
    saveToLocalStorage();
  }
};
