export type ActivityType = 'Tarea' | 'Evento' | 'Habito';

export interface IActivity {
  id: number;
  rutinaId: number;
  ninosId: number;
  titulo?: string | null;
  descripcion?: string | null;
  diaSemana?: number | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  color?: string | null;
  tipo: ActivityType;
  ubicacion?: any | null;
  usuarioResponsable?: number | null;
}
