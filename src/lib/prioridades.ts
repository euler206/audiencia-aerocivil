
import { plazas } from './plazas';
import { aspirantes } from './aspirantes';
import { saveToLocalStorage } from './storage';
import { isPlazaAvailable } from './plazas';
import { Aspirante } from './types';
import { supabase } from '@/integrations/supabase/client';

// Get available plaza based on priorities
export const getAvailablePlazaByPriority = (
  priorities: { municipio: string, prioridad: number }[],
  aspirantePuesto: number
): string => {
  // Sort priorities by priority number
  const sortedPriorities = [...priorities].sort((a, b) => a.prioridad - b.prioridad);
  console.log(`Verificando plazas disponibles para puesto ${aspirantePuesto}, con ${sortedPriorities.length} prioridades`);
  
  // Find the first available plaza
  for (const priority of sortedPriorities) {
    console.log(`Verificando disponibilidad de ${priority.municipio} (prioridad ${priority.prioridad}) para puesto ${aspirantePuesto}`);
    if (isPlazaAvailable(priority.municipio, aspirantePuesto, aspirantes)) {
      console.log(`Plaza ${priority.municipio} disponible para puesto ${aspirantePuesto}`);
      return priority.municipio;
    } else {
      console.log(`Plaza ${priority.municipio} NO disponible para puesto ${aspirantePuesto} (ya ocupada por aspirantes con mejor puesto)`);
    }
  }
  
  // If no plaza is available, return empty string
  console.log(`No se encontraron plazas disponibles para el puesto ${aspirantePuesto}`);
  return "";
};

// Función para reasignar a un aspirante a su siguiente plaza prioritaria disponible
export const reasignarSiguientePrioridad = async (aspirante: Aspirante): Promise<void> => {
  // Si el aspirante no tiene plaza asignada, no hacer nada
  if (!aspirante.plazaDeseada) {
    console.log(`Aspirante ${aspirante.cedula} no tiene plaza asignada, no es necesario reasignar`);
    return;
  }
  
  console.log(`Reasignando aspirante ${aspirante.cedula} (puesto ${aspirante.puesto}) desde plaza ${aspirante.plazaDeseada}`);
  
  // Buscar las prioridades del aspirante almacenadas en localStorage y Supabase
  let prioridadesString = localStorage.getItem(`prioridades_${aspirante.cedula}`);
  let prioridades: { municipio: string, prioridad: number }[] = [];
  
  if (!prioridadesString) {
    // Si no hay prioridades en localStorage, intentar buscar en Supabase
    try {
      const { data: prioridadesData, error } = await supabase
        .from('prioridades')
        .select('*')
        .eq('aspirante_id', aspirante.cedula);
      
      if (!error && prioridadesData && prioridadesData.length > 0) {
        console.log(`Prioridades de ${aspirante.cedula} encontradas en Supabase:`, prioridadesData);
        prioridades = prioridadesData.map(p => ({
          municipio: p.municipio || '',
          prioridad: p.prioridad
        }));
        // Actualizar localStorage para futuras operaciones
        localStorage.setItem(`prioridades_${aspirante.cedula}`, JSON.stringify(prioridades));
      } else {
        console.log(`No se encontraron prioridades para ${aspirante.cedula} en Supabase`);
      }
    } catch (error) {
      console.error(`Error al obtener prioridades de ${aspirante.cedula} desde Supabase:`, error);
    }
  } else {
    // Convertir el string de prioridades a un array
    prioridades = JSON.parse(prioridadesString);
  }
  
  if (prioridades.length === 0) {
    // Si no hay prioridades guardadas en ninguna parte, simplemente quitar la plaza
    console.log(`No se encontraron prioridades para ${aspirante.cedula}, quitando asignación de plaza`);
    const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
    if (index >= 0) {
      aspirantes[index].plazaDeseada = '';
      await saveToLocalStorage();
    }
    return;
  }
  
  // Ordenar prioridades
  prioridades.sort((a, b) => a.prioridad - b.prioridad);
  console.log(`Prioridades ordenadas de ${aspirante.cedula}:`, prioridades);
  
  // Buscar la siguiente plaza disponible según las prioridades
  const plazaAnterior = aspirante.plazaDeseada;
  let plazaNuevaAsignada = false;
  
  for (const prioridad of prioridades) {
    const plazaObj = plazas.find(p => p.municipio === prioridad.municipio);
    if (!plazaObj) {
      console.log(`Plaza ${prioridad.municipio} no encontrada en la lista de plazas`);
      continue;
    }
    
    // Verificar disponibilidad considerando sólo aspirantes con mejor puesto
    if (isPlazaAvailable(prioridad.municipio, aspirante.puesto, aspirantes)) {
      // La plaza está disponible, asignarla
      const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
      if (index >= 0) {
        console.log(`Asignando plaza ${prioridad.municipio} a ${aspirante.cedula} (puesto ${aspirante.puesto})`);
        aspirantes[index].plazaDeseada = prioridad.municipio;
        plazaNuevaAsignada = true;
        
        // Verificar si este cambio afecta a otros aspirantes
        if (plazaAnterior !== prioridad.municipio) {
          await cascadePlazaUpdates(aspirante.puesto, prioridad.municipio);
        }
        
        break; // Terminamos la búsqueda porque ya encontramos una plaza
      }
    } else {
      console.log(`Plaza ${prioridad.municipio} no disponible para ${aspirante.cedula} (puesto ${aspirante.puesto})`);
    }
  }
  
  // Si no se encontró ninguna plaza disponible y la plaza anterior era diferente, quitar la asignación
  if (!plazaNuevaAsignada) {
    console.log(`No se encontró plaza disponible para ${aspirante.cedula}, quitando asignación`);
    const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
    if (index >= 0) {
      aspirantes[index].plazaDeseada = '';
      await saveToLocalStorage();
    }
  }
};

// Función para actualizar en cascada las plazas cuando hay conflictos de prioridad
export const cascadePlazaUpdates = async (puestoOriginal: number, plazaNueva: string) => {
  // Encontrar todos los aspirantes que tienen la misma plaza y están en puestos inferiores
  const aspirantesAfectados = aspirantes
    .filter(a => a.plazaDeseada === plazaNueva && a.puesto > puestoOriginal)
    .sort((a, b) => a.puesto - b.puesto); // Ordenar por puesto (ascendente)
  
  if (aspirantesAfectados.length === 0) {
    console.log(`No hay aspirantes afectados por el cambio en la plaza ${plazaNueva}`);
    await saveToLocalStorage();
    return;
  }
  
  console.log(`Hay ${aspirantesAfectados.length} aspirantes afectados por el cambio en la plaza ${plazaNueva}`);
  
  // Encontrar cuántos aspirantes hay seleccionados para la plaza nueva
  const plazaSeleccionada = plazas.find(p => p.municipio === plazaNueva);
  if (!plazaSeleccionada) {
    console.log(`Plaza ${plazaNueva} no encontrada en la lista de plazas`);
    await saveToLocalStorage();
    return;
  }
  
  // Contar cuántos aspirantes con mejor puesto ya seleccionaron esta plaza
  const aspirantesConMejorPuesto = aspirantes.filter(
    a => a.plazaDeseada === plazaNueva && a.puesto <= puestoOriginal
  ).length;
  
  console.log(`Plaza ${plazaNueva} tiene ${aspirantesConMejorPuesto} aspirantes con mejor puesto y ${plazaSeleccionada.vacantes} vacantes`);
  
  // Si hay más aspirantes con mejor puesto que vacantes, reasignar a los aspirantes afectados
  if (aspirantesConMejorPuesto >= plazaSeleccionada.vacantes) {
    // Ordenamos por puesto para que los mejores puestos tengan prioridad
    const aspirantesExcedentes = aspirantesAfectados.slice(
      0, Math.max(0, aspirantesConMejorPuesto + aspirantesAfectados.length - plazaSeleccionada.vacantes)
    );
    
    console.log(`Hay ${aspirantesExcedentes.length} aspirantes excedentes que necesitan reasignación`);
    
    for (const aspiranteAfectado of aspirantesExcedentes) {
      console.log(`Reasignando aspirante afectado ${aspiranteAfectado.cedula} (puesto ${aspiranteAfectado.puesto})`);
      // Buscar sus prioridades y reasignar
      await reasignarSiguientePrioridad(aspiranteAfectado);
    }
  }
  
  await saveToLocalStorage();
};

// Verificar si hay aspirantes que prefieren una plaza específica
export const verificarAspirantesInteresados = async (plazaLiberada: string): Promise<void> => {
  console.log(`Verificando si hay aspirantes interesados en la plaza liberada: ${plazaLiberada}`);
  
  // Ordenar los aspirantes por puesto para dar prioridad a los mejores puestos
  const aspirantesOrdenados = [...aspirantes].sort((a, b) => a.puesto - b.puesto);
  
  for (const aspirante of aspirantesOrdenados) {
    if (aspirante.plazaDeseada === plazaLiberada) {
      // Este aspirante ya tiene esta plaza asignada, no hacer nada
      continue;
    }
    
    // Verificar si este aspirante tiene prioridades guardadas
    let prioridadesString = localStorage.getItem(`prioridades_${aspirante.cedula}`);
    let prioridades: { municipio: string, prioridad: number }[] = [];
    
    if (!prioridadesString) {
      // Intentar buscar prioridades en Supabase
      try {
        const { data: prioridadesData, error } = await supabase
          .from('prioridades')
          .select('*')
          .eq('aspirante_id', aspirante.cedula);
          
        if (!error && prioridadesData && prioridadesData.length > 0) {
          prioridades = prioridadesData.map(p => ({
            municipio: p.municipio || '',
            prioridad: p.prioridad
          }));
          // Actualizar localStorage para futuras operaciones
          localStorage.setItem(`prioridades_${aspirante.cedula}`, JSON.stringify(prioridades));
        }
      } catch (error) {
        console.error(`Error al obtener prioridades de ${aspirante.cedula} desde Supabase:`, error);
      }
    } else {
      prioridades = JSON.parse(prioridadesString);
    }
    
    if (prioridades.length === 0) {
      // No tiene prioridades guardadas
      continue;
    }
    
    // Verificar si la plaza liberada está entre sus prioridades
    const prioridadPlazaLiberada = prioridades.find(p => p.municipio === plazaLiberada);
    if (!prioridadPlazaLiberada) {
      // No le interesa esta plaza
      continue;
    }
    
    // Verificar si la plaza liberada es de mayor prioridad que su plaza actual
    const prioridadPlazaActual = prioridades.find(p => p.municipio === aspirante.plazaDeseada);
    const esMejorPrioridad = !prioridadPlazaActual || prioridadPlazaLiberada.prioridad < prioridadPlazaActual.prioridad;
    
    // Verificar si la plaza está disponible para este aspirante
    const plazaDisponible = isPlazaAvailable(plazaLiberada, aspirante.puesto, aspirantes);
    
    if (esMejorPrioridad && plazaDisponible) {
      console.log(`Aspirante ${aspirante.cedula} prefiere la plaza ${plazaLiberada} (prioridad ${prioridadPlazaLiberada.prioridad}) sobre su plaza actual ${aspirante.plazaDeseada || 'ninguna'} ${prioridadPlazaActual ? `(prioridad ${prioridadPlazaActual.prioridad})` : ''}`);
      
      const plazaAnterior = aspirante.plazaDeseada;
      const index = aspirantes.findIndex(a => a.cedula === aspirante.cedula);
      
      if (index >= 0) {
        // Asignar la nueva plaza al aspirante
        aspirantes[index].plazaDeseada = plazaLiberada;
        
        // Actualizar en Supabase
        try {
          const { error } = await supabase
            .from('aspirantes')
            .update({ plaza_deseada: plazaLiberada })
            .eq('cedula', aspirante.cedula);
            
          if (error) {
            console.error(`Error al actualizar aspirante ${aspirante.cedula} en Supabase:`, error);
          }
        } catch (error) {
          console.error(`Error en la actualización de ${aspirante.cedula} en Supabase:`, error);
        }
        
        // Si este aspirante tenía una plaza anterior, verificar si alguien más puede aprovecharla
        if (plazaAnterior) {
          console.log(`Aspirante ${aspirante.cedula} liberó la plaza ${plazaAnterior}, verificando si alguien más puede aprovecharla`);
          await verificarAspirantesInteresados(plazaAnterior);
        }
        
        // Verificar si hay conflictos con la nueva asignación
        await cascadePlazaUpdates(aspirante.puesto, plazaLiberada);
        
        // Solo reasignamos a un aspirante por cada llamada para mantener el control de la cascada
        break;
      }
    }
  }
  
  await saveToLocalStorage();
};
