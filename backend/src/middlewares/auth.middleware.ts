import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UnauthorizedError } from "../utils";
import prisma from "../config/prisma.config";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "ERROR: JWT_SECRET no está definido en las variables de entorno. La aplicación no puede iniciar de forma segura."
  );
  process.exit(1);
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
    console.log('🔑 Verificando token de autenticación...');
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError(
        "Token de autenticación no proporcionado o formato incorrecto.", {
          error: "MISSING_AUTH_HEADER"}
      );
    }

    // Extraer solo el token (quitar "Bearer ")
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("Token de autenticación no proporcionado.");
    }

    // 2. Verificar el token
    let decodedPayload: { id: number; email: string; iat: number; exp: number };
    try {
      decodedPayload = jwt.verify(
        token,
        JWT_SECRET as string
      ) as typeof decodedPayload;
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("El token de autenticación ha expirado.", {
          error: "TOKEN_EXPIRED",});
      }
      throw new UnauthorizedError("Token de autenticación inválido.", {
        error: "INVALID_TOKEN",
      });
    }

    // Verificar que el usuario no haya sido eliminado
    const user = await prisma.usuarios.findUnique({
      where: { id: decodedPayload.id, borrado: false },
      select: { id: true, email: true },
    });

    if (!user) {
      throw new UnauthorizedError("Usuario asociado al token no encontrado.", {
        error: "USER_DELETED",
      });
    }

    // CRUCIAL: De esta forma asignamos el usuario a la request extrayendo su data del token.
    // El backend puede manejar al user gracias a esto

    req.user  = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error: any) {
    next(error);
  }
};
