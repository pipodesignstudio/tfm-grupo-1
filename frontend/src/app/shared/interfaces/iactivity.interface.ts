type ActivityType = 'Tarea' | 'Evento' | 'Habito';

export interface IActivity {
  id: number;
  id_rutina: number | null;
  ninos_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date;
  hora_inicio: Date;
  hora_fin: Date;
  color: string | null;
  tipo: ActivityType;
  ubicacion: IUbicacion | null;
  usuario_responsable: number;
  completado: boolean | null;
}

interface IUbicacion {
  address: string;
  lat: number;
  lon: number;
}