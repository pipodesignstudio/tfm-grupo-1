interface IErrorData {
    [key: string]: any;
}

export class CustomError extends Error {
    public statusCode: number;
    public isServerError: boolean;
    public data: IErrorData | null;

    constructor(message: string, statusCode: number, data: IErrorData | null) {
        super(message);
        this.statusCode = statusCode;
        this.isServerError = false; // Por defecto, no es un error del servidor 
        this.data = data || {};
    }
}

export class BadRequestError extends CustomError {
  constructor(message = 'La solicitud es inválida.', data: IErrorData | null = null) {
    super(message, 400, data);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'No autenticado.', data: IErrorData | null = null) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'No tienes permiso para acceder a este recurso.', data: IErrorData | null = null) {
    super(message, 403, data);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'El recurso solicitado no fue encontrado.', data: IErrorData | null = null) {
    super(message, 404, data);
  }
}

export class ConflictError extends CustomError {
  constructor(message = 'Conflicto: el recurso ya existe o el estado es inválido.', data: IErrorData | null = null) {
    super(message, 409, data);
  }
}

// Errores 5xx (errores del servidor)
export class InternalServerError extends CustomError {
  constructor(message = 'Ocurrió un error interno del servidor.', data: IErrorData | null = null) {
    super(message, 500, data);
    this.isServerError = true; 
  }
}