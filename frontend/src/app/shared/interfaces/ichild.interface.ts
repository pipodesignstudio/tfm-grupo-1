export interface IChild {
  id: number;
  familia_id: number;
  perfiles_aprendizaje_id: number;
  nombre: string;
  apellido: string;
  img_perfil?: string | null;
  fecha_nacimiento: string;
  descripcion?: string | null;
  genero?: string | null;
  peso?: number | null;
  altura?: number | null;
}
