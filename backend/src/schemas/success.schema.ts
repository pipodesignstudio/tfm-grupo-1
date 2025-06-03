
export const SuccessApiResponseSchema = {
  type: "object",
  required: ["success", "message", "statusCode"],
  properties: {
    success: {
      type: "boolean",
      description: "Indica si la operación fue exitosa",
      enum: [true],
      example: true,
    },
    message: {
      type: "string",
      description: "Mensaje descriptivo del resultado",
      default: "Success",
      example: "Operación realizada exitosamente",
    },
    statusCode: {
      type: "number",
      description: "Código de estado HTTP de la respuesta",
      minimum: 200,
      maximum: 299,
      example: 200,
    },
    data: {
      description: "Datos de la respuesta (puede ser cualquier tipo)",
      nullable: true,
    },
  },
  additionalProperties: false,
};

export const UserApiResponseSchema = {
  type: "object",
  required: ["success", "message", "statusCode", "data"],
  properties: {
    success: {
      type: "boolean",
      description: "Indica si la operación fue exitosa",
      enum: [true],
      example: true,
    },
    message: {
      type: "string",
      description: "Mensaje descriptivo del resultado",
      default: "Success",
      example: "Operación realizada exitosamente",
    },
    statusCode: {
      type: "number",
      description: "Código de estado HTTP de la respuesta",
      minimum: 200,
      maximum: 299,
      example: 200,
    },
    data: {
      type: "object",
      description: "Datos de la respuesta (puede ser cualquier tipo)",
      properties: {
        user: {
          type: "object",
          description: "Información del usuario",
          properties: {
            name: {
              type: "string",
              description: "Nombre del usuario",
              example: "Juan",
            },
            apellido: {
              type: "string",
              description: "Apellido del usuario",
              example: "Gómez",
            },
            email: {
              type: "string",
              description: "Correo electrónica del usuario",
              format: "email",
              example: "6bV4t@example.com",
            },
            nick: {
              type: "string",
              description: "Nickname del usuario",
              example: 'jgomez',
            },
            img_perfil: {
              type: "string",
              format: "byte",
              description: "Blob de la imagen del usuario",
              example: "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+AdzWvAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5QgCDzcj2aZkGAAAAFRJREFUOMtjYGBg+M8ABf24419N+yYMDk4sLMDg4sLADg4sDAjDgcHGBjBgYGACqJcGBgY/kO0E0cHBwf12YjYg/4v///8PjAwAAJ8/zY+C+A6iAAAAAElFTkSuQmCC",
            },
          },
          required: ["id", "name", "email"],
          additionalProperties: false,
        },
      },
      required: ["user"],
      additionalProperties: false,
    },
  },
  additionalProperties: false,
};


export const SuggestionApiResponseSchema = {
  type: "object",
  required: ["success", "message", "statusCode"],
  properties: {
    success: {
      type: "boolean",
      description: "Indica si la operación fue exitosa",
      enum: [true],
      example: true,
    },
    message: {
      type: "string",
      description: "Mensaje descriptivo del resultado",
      default: "Success",
      example: "Operación realizada exitosamente",
    },
    statusCode: {
      type: "number",
      description: "Código de estado HTTP de la respuesta",
      minimum: 200,
      maximum: 299,
      example: 200,
    },
    data: {
      description: "Listado de sugerencias construidas. Máximo de tres",
      nullable: false,
      example: [
        {
            "titulo": "Preparar mochila para el colegio",
            "descripcion": "Revisar la lista de material y guardar lo necesario para el día siguiente.",
            "dia_semana": 0,
            "hora_inicio": "2024-07-21T19:00:00.000Z",
            "color": "#8C7AE6",
            "tipo": "Hábito"
        },
        {
            "titulo": "Jugar a las sumas y restas",
            "descripcion": "Usar tarjetas o juegos de mesa para practicar operaciones básicas.",
            "dia_semana": 2,
            "hora_inicio": "2024-07-23T16:00:00.000Z",
            "color": "#FFB100",
            "tipo": "Tarea"
        },
        {
            "titulo": "Tiempo de juego libre al aire libre",
            "descripcion": "Salir al patio o parque para jugar y correr.",
            "dia_semana": 5,
            "hora_inicio": "2024-07-26T17:30:00.000Z",
            "color": "#2ECC71",
            "tipo": "Evento"
        }
    ],
    },
  },
  additionalProperties: false,
};