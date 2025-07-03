import { IActivity } from './iactivity.interface';

export interface IRoutine {
  id: number;
  nombre: string;
  descripcion?: string;
  frecuencia?: any;
  fecha_creacion?: string;
  fecha_fin?: string;
  actividades?: IActivity[];
  ninosId?: number;
  tipo?: string;
}
