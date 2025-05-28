import { IUser } from "../interfaces";

declare global {
  namespace Express {
    interface Request {
      user?: Omit<
        IUser,
        'contrasena' | 'primera_sesion' | 'fecha_creacion' | 'nombre' | 'apellido'
      >;
    }
  }
}

export {};