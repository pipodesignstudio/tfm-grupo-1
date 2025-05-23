export interface IUser {
    id: number; 
    nombre: string | null; 
    apellido: string | null;
    email: string;
    contrasena: string;
    primera_sesion: boolean | null; 
    fecha_creacion: Date | null; 
}