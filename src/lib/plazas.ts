
import { Plaza } from './types';

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

// Check if a plaza is available based on aspirante position
export const isPlazaAvailable = (municipio: string, aspirantePuesto: number, aspirantes: any[]): boolean => {
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
