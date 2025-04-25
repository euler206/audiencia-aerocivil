
export interface Plaza {
  departamento: string;
  municipio: string;
  vacantes: number;
  prioridad?: number;
}

export interface Aspirante {
  puesto: number;
  puntaje: number;
  cedula: string;
  nombre: string;
  plazaDeseada: string;
}

// Datos iniciales de plazas
export const plazas: Plaza[] = [
  { departamento: "Antioquia", municipio: "Puerto Berrío", vacantes: 1 },
  { departamento: "Santander", municipio: "Bucaramanga", vacantes: 1 },
  { departamento: "Tolima", municipio: "San Sebastián De Mariquita", vacantes: 1 },
  { departamento: "Antioquia", municipio: "Rionegro", vacantes: 9 },
  { departamento: "Valle del Cauca", municipio: "Palmira", vacantes: 16 },
  { departamento: "Tolima", municipio: "Flandes", vacantes: 1 },
  { departamento: "Casanare", municipio: "Yopal", vacantes: 2 },
  { departamento: "Atlántico", municipio: "Soledad", vacantes: 7 },
  { departamento: "Quindío", municipio: "Armenia", vacantes: 4 },
  { departamento: "Tolima", municipio: "Ibagué", vacantes: 5 },
  { departamento: "Nariño", municipio: "Tumaco", vacantes: 1 },
  { departamento: "Antioquia", municipio: "Amalfi", vacantes: 1 },
  { departamento: "Sucre", municipio: "Santiago De Tolú", vacantes: 1 },
  { departamento: "Bolívar", municipio: "Magangué", vacantes: 1 },
  { departamento: "Norte de Santander", municipio: "Ocaña", vacantes: 1 },
  { departamento: "Chocó", municipio: "Nuquí", vacantes: 2 },
  { departamento: "Casanare", municipio: "Paz De Ariporo", vacantes: 1 },
  { departamento: "Antioquia", municipio: "Remedios", vacantes: 1 },
  { departamento: "Archipiélago de San Andrés, Providencia y Santa Catalina", municipio: "San Andrés", vacantes: 2 },
  { departamento: "Vaupés", municipio: "Mitú", vacantes: 2 },
  { departamento: "Norte de Santander", municipio: "Cúcuta", vacantes: 7 },
  { departamento: "Chocó", municipio: "Condoto", vacantes: 1 },
  { departamento: "Cauca", municipio: "Guapí", vacantes: 2 },
  { departamento: "Bolívar", municipio: "Cartagena De Indias", vacantes: 1 },
  { departamento: "Nariño", municipio: "Pasto", vacantes: 1 },
  { departamento: "Chocó", municipio: "Quibdó", vacantes: 1 },
  { departamento: "Arauca", municipio: "Arauca", vacantes: 1 },
  { departamento: "Amazonas", municipio: "Leticia", vacantes: 1 },
  { departamento: "Risaralda", municipio: "Pereira", vacantes: 2 },
  { departamento: "Magdalena", municipio: "Santa Marta", vacantes: 2 },
  { departamento: "Cundinamarca", municipio: "Bogotá D.C.", vacantes: 11 },
  { departamento: "Cesar", municipio: "Valledupar", vacantes: 2 },
  { departamento: "Valle del Cauca", municipio: "Buenaventura", vacantes: 1 },
  { departamento: "Meta", municipio: "Villavicencio", vacantes: 4 }
];

// Datos iniciales de aspirantes
export const aspirantes: Aspirante[] = [
  { puesto: 1, puntaje: 88.18, cedula: "1082982133", nombre: "DORIS MARIA JIMENEZ OROZCO", plazaDeseada: "" },
  { puesto: 2, puntaje: 85.21, cedula: "1085286283", nombre: "ESTEBAN MAURICIO HERRERA DIAZ", plazaDeseada: "" },
  { puesto: 3, puntaje: 84.46, cedula: "1094953402", nombre: "SANTIAGO PRIETO GOMEZ", plazaDeseada: "" },
  { puesto: 4, puntaje: 83.71, cedula: "29108823", nombre: "AURA PRISCILA ESPINOSA LASSO", plazaDeseada: "" },
  { puesto: 5, puntaje: 83.71, cedula: "1118556362", nombre: "LEIDY PAOLA MORENO BAYONA", plazaDeseada: "" },
  { puesto: 6, puntaje: 82.99, cedula: "1101814897", nombre: "JOSE ALFREDO LUNA CHAJIN", plazaDeseada: "" },
  { puesto: 7, puntaje: 82.96, cedula: "1192890646", nombre: "NAIDEE ROCIO RANGEL ANGULO", plazaDeseada: "" },
  { puesto: 8, puntaje: 82.90, cedula: "1140891729", nombre: "VANESSA MORALES MEJIA", plazaDeseada: "" },
  { puesto: 9, puntaje: 82.28, cedula: "38553415", nombre: "NERSY ARANA LOZADA", plazaDeseada: "" },
  { puesto: 10, puntaje: 82.24, cedula: "1042446734", nombre: "MILEYDIS DUNCAN DE AVILA", plazaDeseada: "" },
  { puesto: 11, puntaje: 82.24, cedula: "1002955695", nombre: "DORA STELLA TORRES HURTADO", plazaDeseada: "" },
  { puesto: 12, puntaje: 82.21, cedula: "1140837304", nombre: "ANGELICA MARIA RUIZ GUIO", plazaDeseada: "" },
  { puesto: 13, puntaje: 82.21, cedula: "49721909", nombre: "RUBIS PAOLA GRACIA PEREZ", plazaDeseada: "" },
  { puesto: 14, puntaje: 82.21, cedula: "10842255683", nombre: "BYRON FELIPE NARVAEZ GRANDA", plazaDeseada: "" },
  { puesto: 15, puntaje: 82.18, cedula: "1233189629", nombre: "ANGIE VANESSA MENESES GUERRERO", plazaDeseada: "" },
  { puesto: 16, puntaje: 81.53, cedula: "1001635722", nombre: "ROMER DARIO GUZMAN ARTEAGA", plazaDeseada: "" },
  { puesto: 17, puntaje: 81.53, cedula: "1113638106", nombre: "MARCELA ROMERO SANCHEZ", plazaDeseada: "" },
  { puesto: 18, puntaje: 81.53, cedula: "1031149634", nombre: "CRISTIAN ANDREY MARTINEZ URQUIJO", plazaDeseada: "" },
  { puesto: 19, puntaje: 81.49, cedula: "12996873", nombre: "JAIME ALVARO DELGADO VILLOTA", plazaDeseada: "" },
  { puesto: 20, puntaje: 81.46, cedula: "1092387051", nombre: "HANER JHOAN LEAL CHACON", plazaDeseada: "" },
  // The rest of the data (to be continued in local storage)
];

// Helper function to get user from cedula
export const getAspiranteByCredentials = (cedula: string, opec: string): Aspirante | undefined => {
  // Verify OPEC number
  if (opec !== "209961") {
    return undefined;
  }
  
  // Find user by cedula
  return aspirantes.find(aspirante => aspirante.cedula === cedula);
};

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

// Update aspirante's plaza deseada
export const updatePlazaDeseada = (cedula: string, plaza: string) => {
  const aspiranteIndex = aspirantes.findIndex(a => a.cedula === cedula);
  if (aspiranteIndex >= 0) {
    aspirantes[aspiranteIndex].plazaDeseada = plaza;
    saveToLocalStorage();
    return true;
  }
  return false;
};

// Check if a plaza is available based on aspirante position
export const isPlazaAvailable = (municipio: string, aspirantePuesto: number): boolean => {
  // Find the plaza
  const plaza = plazas.find(p => p.municipio === municipio);
  if (!plaza) return false;
  
  // Count how many aspirantes with better position already selected this plaza
  const selectedCount = aspirantes
    .filter(a => a.plazaDeseada === municipio && a.puesto < aspirantePuesto)
    .length;
  
  // Check if there are still vacancies available
  return selectedCount < plaza.vacantes;
};

// Get available plaza based on priorities
export const getAvailablePlazaByPriority = (
  priorities: { municipio: string, prioridad: number }[],
  aspirantePuesto: number
): string => {
  // Sort priorities by priority number
  const sortedPriorities = [...priorities].sort((a, b) => a.prioridad - b.prioridad);
  
  // Find the first available plaza
  for (const priority of sortedPriorities) {
    if (isPlazaAvailable(priority.municipio, aspirantePuesto)) {
      return priority.municipio;
    }
  }
  
  // If no plaza is available, return empty string
  return "";
};
