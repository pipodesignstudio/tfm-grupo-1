export interface IUser {
  id: number;
  nombre: string | null;
  apellido: string | null;
  nick: string; 
  img_perfil: Uint8Array  | null; 
  email: string; 
  contrasena: string; 
  primera_sesion: boolean; 
  fecha_creacion: Date; 
  borrado: boolean; 
  email_verificado: boolean; 
}