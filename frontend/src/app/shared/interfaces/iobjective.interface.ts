export interface IObjetivo {
  id: number;
  nombre: string;
  ninos_id: number;
  color?: string | null;
  tipo?: string | null;
  fecha_fin?: string | null; 
  objetivos_has_actividades?: {
    actividad_id: number;
  }[];
}

export interface ObjetivoDto {
  nombre: string;
  color?: string | null;
  tipo?: string | null;
  fecha_fin?: string | null;
}