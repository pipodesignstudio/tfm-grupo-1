export interface IErrorData {
    [key: string]: any;
}

export class CustomError extends Error {
    public statusCode: number;
    public isServerError: boolean;
    public data: IErrorData | null;

    constructor(message: string, statusCode: number, data: IErrorData | null, isServerError: boolean) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype); // Forzar el reconocimiento en el middleware
        this.statusCode = statusCode;
        this.isServerError = isServerError;
        this.data = data || {};
    }
}

export class BadRequestError extends CustomError {
  constructor(message = 'La solicitud es inválida.', data: IErrorData | null = null, isServerError = false) {
    super(message, 400, data, isServerError);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'No autenticado.', data: IErrorData | null = null, isServerError:boolean = false) {
    super(message, 401, data, isServerError);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message = 'No tienes permiso para acceder a este recurso.', data: IErrorData | null = null, isServerError:boolean = false) {
    super(message, 403, data, isServerError);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'El recurso solicitado no fue encontrado.', data: IErrorData | null = null, isServerError:boolean = false) {
    super(message, 404, data, isServerError);
  }
}

export class ConflictError extends CustomError {
  constructor(message = 'Conflicto: el recurso ya existe o el estado es inválido.', data: IErrorData | null = null, isServerError:boolean = false) {
    super(message, 409, data, isServerError);
  }
}

export class InvalidInputError extends CustomError {
  constructor(message = 'Error de tipo: el tipo de dato no es válido.', data: IErrorData | null = null, isServerError:boolean = false) {
    super(message, 400, data, isServerError);
  }
}

// Errores 5xx (errores del servidor)
export class InternalServerError extends CustomError {
  constructor(message = 'Ocurrió un error interno del servidor.', data: IErrorData | null = null, isServerError:boolean = true) {
    super(message, 500, data, isServerError);
  }
}