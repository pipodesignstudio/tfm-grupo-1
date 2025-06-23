export const createActividadDtoSchema = {
  type: 'object',
  required: [
    'nino_id',
    'titulo',
    'tipo',
    'fecha_realizacion',
    'hora_inicio',
    'hora_fin',
    'usuario_responsable'
  ],
  properties: {
    nino_id: {
      type: 'integer',
      minimum: 1
    },
    rutina_id: {
      type: ['integer', 'null'],
      minimum: 1
    },
    titulo: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      example: 'Aprender a atarse los zapatos',
    },
    descripcion: {
      type: 'string',
    },
    fecha_realizacion: {
      type: 'string',
      format: 'date',
    },
    hora_inicio: {
      type: 'string',
      format: 'date-time', // Cambiado a date-time porque usas Date, no solo hora
    },
    hora_fin: {
      type: 'string',
      format: 'date-time',
    },
    color: {
      type: 'string',
    },
    ubicacion: {
      type: 'object',
    },
    usuario_responsable: {
      type: 'integer',
      minimum: 1
    },
    completado: {
      type: 'boolean',
      default: false,
    },
    tipo: {
      type: 'string',
      enum: ['Objetivo', 'Rutina', 'Evento'],
      example: 'Objetivo',
    },
  },
  additionalProperties: false
};


export const UpdateActividadDtoSchema = {
  type: 'object',
  required: [
    'nino_id',
    'titulo',
    'tipo',
    'fecha_realizacion',
    'hora_inicio',
    'hora_fin',
    'usuario_responsable'
  ],
  properties: {
    nino_id: {
      type: 'integer',
      minimum: 1
    },
    rutina_id: {
      type: ['integer', 'null'],
      minimum: 1
    },
    titulo: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    descripcion: {
      type: 'string',
    },
    fecha_realizacion: {
      type: 'string',
      format: 'date',
    },
    hora_inicio: {
      type: 'string',
      format: 'date-time',
    },
    hora_fin: {
      type: 'string',
      format: 'date-time',
    },
    color: {
      type: 'string',
    },
    ubicacion: {
      type: 'object',
    },
    usuario_responsable: {
      type: 'integer',
      minimum: 1
    },
    completado: {
      type: 'boolean',
    },
    tipo: {
      type: 'string',
      enum: ['Objetivo', 'Rutina', 'Evento'],
    },
  },
  additionalProperties: false,
  minProperties: 1
};


export const ExportActivitiesDtoSchema = {
  type: 'object',
  required: ['activities'],
  properties: {
    activities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          titulo: { type: 'string' },
          tipo: { type: 'string' },
          fecha_realizacion: { type: 'string' },
          hora_inicio: { type: 'string' },
          hora_fin: { type: 'string' },
          color: { type: 'string' },
          ubicacion: { type: 'object' },
          usuario_responsable: { type: 'integer' },
          completado: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
  },
  additionalProperties: false,
};