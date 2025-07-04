export interface IObjective {
  id: number;
  rutinasId: number;
  nombre: string;
  color?: string | null;
  tipo?: string | null;
}

export interface ObjetivoDto {
  nombre: string;
  color?: string | null;
  tipo?: string | null;
  fecha_fin?: string | null;
}