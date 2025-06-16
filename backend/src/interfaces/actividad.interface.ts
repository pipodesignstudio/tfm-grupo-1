import { Prisma } from "@prisma/client";

export interface IActividad {
  id: number;
  rutina_id: number;
  ninos_id: number;
  titulo: string | null;
  descripcion: string | null;
  dia_semana: number | null;
  hora_inicio: Date | null;
  hora_fin: Date | null;
  color: string | null;
  tipo: string;
  ubicacion: Prisma.JsonValue | null;
  usuario_responsable: number | null;
}
export interface Ubicacion {
    lugar: string;
}

export interface IActividadSuggestion {
  titulo: string;
  descripcion: string;
  dia_semana: number;
  hora_inicio: Date;
  color: string;
  tipo: 'Hábito' | 'Tarea' | 'Evento';
}