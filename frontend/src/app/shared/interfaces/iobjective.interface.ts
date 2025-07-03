// Interfaz que representa un objetivo recibido desde la API
export interface IObjective {
  id: number;
  nombre: string;
  ninos_id: number;
  color?: string | null;
  tipo?: string | null;
  fecha_inicio?: string | null;
  fecha_fin?: string | null;
  actividades_ids?: number[]; // array de IDs relacionados
}

// Para crear o actualizar un objetivo (POST y PUT)
export interface IObjectiveCreateOrUpdate {
  nombre: string;
  color?: string;
  tipo?: string;
  fecha_fin?: string;
  actividades_ids?: number[]; // array de IDs de actividades
}
