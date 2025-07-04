export interface IObjetivo {
  id: number;
  nombre: string;
  ninos_id: number;
  color?: string | null;
  tipo?: string | null;
  fecha_fin?: string | null; // puede venir como string de la API
  objetivos_has_actividades?: {
    actividad_id: number;
  }[];
}
