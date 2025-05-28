declare namespace Express {
  export interface Request {
    user?: Omit<
      IUser,
      "contrasena" | "primera_sesion" | "fecha_creacion" | "nombre" | "apellido"
    >;
  }
}