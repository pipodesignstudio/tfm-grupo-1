// src/middlewares/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { BadRequestError, IErrorData } from "../utils";

/**
 * Middleware para validar el cuerpo de la solicitud usando una clase DTO.
 *
 * @param dtoClass La clase DTO que vamos a validar
 * @param validateOnlyProvidedFields Si es 'true', las propiedades no presentes en el body no se validan.
 */
export function validationMiddleware<T>(
  dtoClass: new () => T,
  validateOnlyProvidedFields = false
) {
  return (req: Request, res: Response, next: NextFunction) => {
    
const dtoInstance = plainToInstance(dtoClass, req.body || {});

    validate(dtoInstance as object, {
      skipMissingProperties: validateOnlyProvidedFields,
    })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          // Si hay errores, los pasamos a la interfaz global.
          const formattedErrors: IErrorData = {};
          errors.forEach((error) => {
            if (error.constraints) {
              // Toma el primer mensaje de error por cada propiedad.
              const constraintKey = Object.keys(error.constraints)[0];
              formattedErrors[error.property] =
                error.constraints[constraintKey];
            }
          });
          next(
            new BadRequestError(
              "Errores de validación en la solicitud.",
              formattedErrors
            )
          );
        } else {
          req.body = dtoInstance;
          next();
        }
      })
      .catch((err) => {
        // Lo que no podamos controlar, lo pasamos al middleware global de error.
        next(err);
      });
  };
}
