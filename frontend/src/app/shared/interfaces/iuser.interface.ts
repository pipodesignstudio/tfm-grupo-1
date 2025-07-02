export interface IUser {
  id: number;
  apellido: string | null;
  nombre: string | null;
  nick: string;
  img_perfil?: string | Uint8Array | null;
  email: string;
  contrasena: string;
  primeraSesion: boolean;
  fechaCreacion: string;
  borrado: boolean;
  emailVerificado: boolean;
}
