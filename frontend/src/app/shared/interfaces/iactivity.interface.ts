type ActivityType = 'Objetivo' | 'Rutina' | 'Evento' | 'Tarea';

export interface IActivity {
  id: number;
  rutina_id: number | null;
  ninos_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date;
  hora_inicio: Date | string;
  hora_fin: Date | string;
  color: string | null;
  tipo: ActivityType;
  ubicacion: IUbicacion | null;
  usuario_responsable?: number;
  completado: boolean | null;
}

interface IUbicacion {
  address: string;
  lat: number;
  lon: number;
}

export interface ActivityDto {
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date;
  hora_inicio: Date;
  hora_fin: Date;
  objetivo_id: number | null;
  completado: boolean | null;
  color: string | null;
  tipo: ActivityType;
}