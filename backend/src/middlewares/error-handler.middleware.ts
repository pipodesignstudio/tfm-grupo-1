// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils';


export const errorHandler = (
  err: Error, // Como la clase personalizado extiende de error lo dejamos así para poder capturar errores no previstsp
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  console.error('❌❌ --- ERROR CAPTURADO ---');
  console.error(`Ruta: ${req.method} ${req.originalUrl}`);
  console.error('Error:', err);
  console.error('----------------------- ❌❌');

  // Valores por defecto para la respuesta
  let statusCode = 500; 
  let message = 'Ocurrió un error interno del servidor.';
  let data: any = {};
  let isServerError = false; 

  // Si el error es una instancia de CustomError, usamos sus propiedades
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    message = err.message;
    data = err.data;
    isServerError = err.isServerError;
  } else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'JSON inválido en el cuerpo de la solicitud.';
    isServerError = true;
    data = { errorType: 'InvalidJsonSyntax' };
  }
  res.status(statusCode).json({
    success: false,
    message,
    data,
    isServerError
  });
};

