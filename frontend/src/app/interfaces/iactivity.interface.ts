export type ActivityType = 'Tarea' | 'Evento' | 'Habito';

export interface IActivity {
  id: number;
  id_rutina: number | null;
  id_nino: number;
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date;
  hora_inicio: Date;
  hora_fin: Date;
  color: string | null;
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
  ubicacion: JSON | null;
  usuario_responsable: number;
  completado: boolean | null;
}