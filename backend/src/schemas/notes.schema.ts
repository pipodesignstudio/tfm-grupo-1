export const NewNoteSchema = {
  type: 'object',
  required: ['ninos_id', 'titulo', 'texto'],
  properties: {
    ninos_id: {
      type: 'number',
      description: 'ID del niño al que pertenece la nota',
      example: 3,
    },
    titulo: {
      type: 'string',
      description: 'Título de la nota',
      example: 'Medicamento',
    },
    texto: {
      type: 'string',
      description: 'Contenido detallado de la nota',
      example: 'Debe tomarse la medicación a las 8:00 am',
    },
  },
  additionalProperties: false,
};

export const UpdateNoteSchema = {
  type: 'object',
  properties: {
    titulo: {
      type: 'string',
      description: 'Nuevo título de la nota',
      example: 'Medicamento',
    },
    texto: {
      type: 'string',
      description: 'Nuevo contenido de la nota',
      example: 'Debe tomarse la medicación a las 10:00 am.',
    },
  },
  additionalProperties: false,
};
