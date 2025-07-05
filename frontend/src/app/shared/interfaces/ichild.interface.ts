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


export interface CreateNinoDto {
    nombre: string;
    perfiles_aprendizaje_id: number;
    familia_id: number;
    apellido: string;
    img_perfil?: string | null;
    fecha_nacimiento: string;
    descripcion?: string | null;
    genero?: string | null;
    peso?: number | null;
    altura?: number | null;
}