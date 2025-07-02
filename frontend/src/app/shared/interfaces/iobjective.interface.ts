import { IActivity } from '../../shared/interfaces/iactivity.interface';

export interface IObjective {
  id: number;
  nombre: string;
  ninos_id: number;
  color?: string | null;
  tipo?: string | null;
  fecha_inicio?: Date | string; 
  fecha_fin?: Date | string | null;
  actividades_ids?: number[];
  activities?: IActivity[]; 
}