export interface IUser {
  id: number;
  apellido: string;
  nombre: string;
  nick: string;
  img_perfil?: string | null;
  email: string;
  contrasena: string;
  primeraSesion: boolean;
  fechaCreacion: string;
  borrado: boolean;
  emailVerificado: boolean;
}
