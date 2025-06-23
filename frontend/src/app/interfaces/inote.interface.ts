export interface INote {
  id: number;
  ninosId: number;
  titulo?: string | null;
  texto?: string | null;
  fechaCreacion: string;
}
