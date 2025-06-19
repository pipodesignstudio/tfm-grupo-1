export interface IRoutine {
  id: number;
  ninosId: number;
  nombre: string;
  descripcion?: string | null;
  fechaCreacion: string;
  frecuencia?: any | null;
  fechaFin?: string | null;
}
