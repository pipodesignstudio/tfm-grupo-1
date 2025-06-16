import { JsonValue } from "@prisma/client/runtime/library";

export interface IActividad {
  id: number;
  rutina_id: number | null;
  ninos_id: number;
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date;
  hora_inicio: Date;
  hora_fin: Date;
  color: string | null;
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
  ubicacion: JsonValue | null;
  usuario_responsable: number;
  completado: boolean | null;
}
export interface Ubicacion {
    lugar: string;
}

export interface IActividadSuggestion {
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date;
  hora_inicio: Date;
  hora_fin: Date;
  color: string | null;
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
}