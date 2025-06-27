export interface INote {
  id: number;
  ninos_id: number;
  titulo: string;
  texto: string;
  fecha_creacion: string;
}

export interface INoteCreate {
  ninos_id: number;
  titulo: string;
  texto: string;
}

export interface INoteUpdate {
  titulo?: string;
  texto?: string;
}
