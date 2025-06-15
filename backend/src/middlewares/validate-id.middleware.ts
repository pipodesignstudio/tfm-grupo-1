import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils";

/**
 * Middleware para validar que el parámetro `id` de la URL es un número válido.
 */
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔎 Validando parámetro ID...");

  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return next(
      new BadRequestError("El parámetro ID debe ser un número válido.", {
        error: "INVALID_ID_PARAM",
        value: id,
      })
    );
  }

  next();
};
