import { JsonValue } from "@prisma/client/runtime/library";

export interface IActividad {
  id: number;
  rutina_id: number | null;
  ninos_id: number;
  titulo: string | null;
  descripcion: string | null;
  fecha_creacion: Date | null;
  fecha_realizacion: Date | null;
  hora_inicio: Date | null;
  hora_fin: Date | null;
  color: string | null;
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
  ubicacion: JsonValue | null;
  usuario_responsable: number;
  completado: boolean | null;
}

export interface IActividadSuggestion {
  titulo: string;
  descripcion: string | null;
  fecha_realizacion: Date | null;
  hora_inicio: Date | null;
  hora_fin: Date | null;
  color: string | null;
  tipo: 'Objetivo' | 'Rutina' | 'Evento';
}

export interface IActividadPdf {
  rutina_name:string;
  nino:string;
  title:string;
  description:string;
  responsable:string;
  fecha_realizacion:Date | null;
  hora_inicio:Date | null;
  hora_fin:Date | null;
  color:string;
  tipo:'Objetivo' | 'Rutina' | 'Evento';
}