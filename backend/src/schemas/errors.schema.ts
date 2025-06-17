
export const CustomErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje descriptivo del error',
      example: 'Error en la aplicación'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      example: 400
    },
    isServerError: {
      type: 'boolean',
      description: 'Indica si es un error del servidor (5xx) o del cliente (4xx)',
      example: false
    },
    data: {
      type: 'object',
      description: 'Datos adicionales específicos del error',
      nullable: true,
      additionalProperties: true,
      example: {
        error: 'ERR_DATA',
      }
    }
  },
  additionalProperties: false
}

// Schema para errores 400 - Bad Request
export const BadRequestErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje del error de solicitud inválida',
      default: 'La solicitud es inválida.',
      example: 'Los datos enviados no son válidos'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [400],
      example: 400
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre false para errores 4xx',
      enum: [false],
      example: false
    },
    data: {
      type: 'object',
      description: 'La solicitud es inválida',
      nullable: true,
      example: {
        validationErrors: [
          {
            field: 'email',
            value: 'invalid-email'
          }
        ]
      }
    }
  },
  additionalProperties: false
}

// Schema para errores 401 - Unauthorized
export const UnauthorizedErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje de error de autenticación',
      default: 'No autenticado.',
      example: 'No autenticado'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [401],
      example: 401
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre false para errores 4xx',
      enum: [false],
      example: false
    },
    data: {
      type: 'object',
      description: 'Información adicional sobre el error de autenticación',
      nullable: true,
    }
  },
  additionalProperties: false
} 

// Schema para errores 403 - Forbidden
export const ForbiddenErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje de error de autorización',
      default: 'No tienes permiso para acceder a este recurso.',
      example: 'Permisos insuficientes para realizar esta acción'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [403],
      example: 403
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre false para errores 4xx',
      enum: [false],
      example: false
    },
    data: {
      type: 'object',
      description: 'Información sobre los permisos requeridos',
      nullable: true
    }
  },
  additionalProperties: false
}

// Schema para errores 404 - Not Found
export const NotFoundErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje de recurso no encontrado',
      default: 'El recurso solicitado no fue encontrado.',
      example: 'El recurso solicitado no fue encontrado.'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [404],
      example: 404
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre false para errores 4xx',
      enum: [false],
      example: false
    },
    data: {
      type: 'object',
      description: 'Información sobre el recurso no encontrado',
      nullable: true,
      properties: {
        resourceType: {
          type: 'string',
          description: 'Tipo de recurso que no se encontró',
          example: 'User'
        },
        resourceId: {
          type: 'string',
          description: 'ID del recurso buscado',
          example: '123e4567-e89b-12d3-a456-426614174000'
        },
        searchCriteria: {
          type: 'object',
          description: 'Criterios de búsqueda utilizados',
          additionalProperties: true,
          example: {
            email: 'usuario@example.com'
          }
        }
      },
      example: {
        resourceType: 'User',
        resourceId: '123e4567-e89b-12d3-a456-426614174000'
      }
    }
  },
  additionalProperties: false
}

// Schema para errores 409 - Conflict
export const ConflictErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje de error de conflicto',
      default: 'Conflicto: el recurso ya existe o el estado es inválido.',
      example: 'El email ya está registrado'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [409],
      example: 409
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre false para errores 4xx',
      enum: [false],
      example: false
    },
    data: {
      type: 'object',
      description: 'Detalles específicos del conflicto',
      nullable: true,
       example: {
        error: 'ERR_DATA',
      }
    }
  },
  additionalProperties: false
}

// Schema para errores de entrada inválida (también 400)
export const InvalidInputErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje de error de tipo de dato inválido',
      default: 'Error de tipo: el tipo de dato no es válido.',
      example: 'El valor debe ser un número'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [400],
      example: 400
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre false para errores 4xx',
      enum: [false],
      example: false
    },
    data: {
      type: 'object',
      description: 'Información sobre el tipo de dato incorrecto',
      nullable: true
    }
  },
  additionalProperties: false
}

// Schema para errores 500 - Internal Server Error
export const InternalServerErrorSchema = {
  type: 'object',
  required: ['message', 'statusCode', 'isServerError'],
  properties: {
    message: {
      type: 'string',
      description: 'Mensaje de error interno del servidor',
      default: 'Ocurrió un error interno del servidor.',
      example: 'Error interno del servidor'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP',
      enum: [500],
      example: 500
    },
    isServerError: {
      type: 'boolean',
      description: 'Siempre true para errores 5xx',
      enum: [true],
      example: true
    },
    data: {
      type: 'object',
      description: 'Información adicional del error (no debe incluir información sensible)',
      nullable: true,
      example: {
        error: 'INTERNAL_ERROR',
      }
    }
  },
  additionalProperties: false
}
