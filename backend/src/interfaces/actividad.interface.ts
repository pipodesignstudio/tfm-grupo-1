import { Prisma } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export interface IActividad {
  id: number;
  rutina_id: number | null;
  ninos_id: number;
  titulo: string | null;
  descripcion: string | null;
  fechas_realizacion: JsonValue  | null;
  dia_semana: number | null;
  hora_inicio: Date | null;
  hora_fin: Date | null;
  color: string | null;
  tipo: string;
  ubicacion: JsonValue | null;
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
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
}