export interface INino {
  id: number;
  perfiles_aprendizaje_id: number;
  familia_id: number;
  nombre: string;
  apellido: string;
  img_perfil?: Buffer | null;
  fecha_nacimiento: Date;
  descripcion?: string | null;
  genero?: string | null;
  peso?: number | null;
  altura?: number | null;
}