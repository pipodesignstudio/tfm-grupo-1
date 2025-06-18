export interface IObjetivo {
  id: number;
  nombre: string;
  ninos_id: number;
  color?: string | null;
  tipo?: string | null;
  fecha_fin?: Date | null;
  // Si sueles incluir las actividades asociadas:
  actividades_ids?: number[];
}
