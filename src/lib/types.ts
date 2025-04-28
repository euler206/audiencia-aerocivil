
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
