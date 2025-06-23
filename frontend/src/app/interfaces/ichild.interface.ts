export interface IChild {
  id: number;
  perfilesAprendizajeId: number;
  nombre: string;
  apellido: string;
  imgPerfil?: string | null;
  fechaNacimiento: string;
  descripcion?: string | null;
  genero?: string | null;
  peso?: number | null;
  altura?: number | null;
}
