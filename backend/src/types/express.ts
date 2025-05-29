import { IUser } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<
        IUser,
        'contrasena' |
        'email_verificado' | 'borrado' |
        'primera_sesion' | 'fecha_creacion' | 'nombre' | 'apellido' | 'nick' | 'img_perfil'
      >;
    }
  }
}

export {};