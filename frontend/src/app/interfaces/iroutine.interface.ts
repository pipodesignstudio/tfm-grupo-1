import { IActivity } from './iactivity.interface';

export interface IRoutine {
  id: number;
  ninosId: number;
  nombre: string;
  descripcion?: string;
  fechaCreacion: string;
  frecuencia?: any | null;
  fechaFin?: string | null;

  actividades?: IActivity[]; // ← Añadido: actividades asociadas a la rutina
}
