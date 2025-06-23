import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../utils";

/**
 * Middleware para validar que los parámetros `id` y `id_nino` sean números válidos.
 */
export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🔎 Validando parámetros ID...");

  const { id, id_nino } = req.params;

  if (id !== undefined && isNaN(Number(id))) {
    return next(
      new BadRequestError("El parámetro ID debe ser un número válido.", {
        error: "INVALID_ID_PARAM",
        value: id,
      })
    );
  }

  if (id_nino !== undefined && isNaN(Number(id_nino))) {
    return next(
      new BadRequestError("El parámetro id_nino debe ser un número válido.", {
        error: "INVALID_NINOS_ID_PARAM",
        value: id_nino,
      })
    );
  }

  next();
};
