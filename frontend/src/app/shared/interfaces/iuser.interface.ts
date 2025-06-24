export interface IUser {
  id: number;
  apellido: string;
  nick: string;
  imgPerfil?: string | null;
  email: string;
  contrasena: string;
  primeraSesion: boolean;
  fechaCreacion: string;
  borrado: boolean;
  emailVerificado: boolean;
}
