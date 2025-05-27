export const SuccessApiResponseSchema = {
  type: 'object',
  required: ['success', 'message', 'statusCode'],
  properties: {
    success: {
      type: 'boolean',
      description: 'Indica si la operación fue exitosa',
      enum: [true],
      example: true
    },
    message: {
      type: 'string',
      description: 'Mensaje descriptivo del resultado',
      default: 'Success',
      example: 'Operación realizada exitosamente'
    },
    statusCode: {
      type: 'number',
      description: 'Código de estado HTTP de la respuesta',
      minimum: 200,
      maximum: 299,
      example: 200
    },
    data: {
      description: 'Datos de la respuesta (puede ser cualquier tipo)',
      nullable: true,
    }
  },
  additionalProperties: false
}