export const createAlergiaDtoSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la alergia',
      example: 'Polen',
    }
  },
  additionalProperties: false
};

export const UpdateAlergiaDtoSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nuevo nombre de la alergia',
      example: 'Ácaros',
    }
  },
  additionalProperties: false,
  minProperties: 1
};