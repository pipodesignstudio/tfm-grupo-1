export const createActividadEventoDtoSchema = {
  type: 'object',
  required: ['titulo', 'tipo'],
  properties: {
    titulo: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Título del evento',
      example: 'Reunión con pediatra',
    },
    descripcion: {
      type: 'string',
      description: 'Descripción opcional del evento',
      example: 'Visita médica en el centro de salud',
    },
    fechas_realizacion: {
      type: 'array',
      description: 'Fechas específicas en que ocurre el evento',
      items: { type: 'string', format: 'date' },
      example: ['2025-06-18'],
    },
    hora_inicio: {
      type: 'string',
      format: 'time',
      example: '09:30',
    },
    hora_fin: {
      type: 'string',
      format: 'time',
      example: '10:30',
    },
    color: {
      type: 'string',
      example: '#FF5733',
    },
    ubicacion: {
      type: 'object',
      description: 'Ubicación en formato JSON',
      example: { lugar: 'Centro de salud', direccion: 'Calle Falsa 123' },
    },
    usuario_responsable: {
      type: 'integer',
      description: 'ID del usuario responsable',
    },
    completado: {
      type: 'boolean',
      default: false,
    },
    tipo: {
      type: 'string',
      enum: ['Evento'],
      example: 'Evento',
    },
    rutina_id: {
      type: ['integer', 'null'],
    },
    dia_semana: {
      type: ['integer', 'null'],
    },
  },
  additionalProperties: false
};
export const createActividadRutinaDtoSchema = {
  type: 'object',
  required: ['titulo', 'tipo', 'rutina_id', 'dia_semana', 'hora_inicio', 'hora_fin'],
  properties: {
    titulo: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      example: 'Cepillarse los dientes',
    },
    descripcion: {
      type: 'string',
    },
    rutina_id: {
      type: 'integer',
    },
    dia_semana: {
      type: 'integer',
      minimum: 0,
      maximum: 6,
      description: 'Día de la semana (0=Domingo, 6=Sábado)',
    },
    hora_inicio: {
      type: 'string',
      format: 'time',
      example: '07:00',
    },
    hora_fin: {
      type: 'string',
      format: 'time',
      example: '07:15',
    },
    color: {
      type: 'string',
    },
    fechas_realizacion: {
      type: 'array',
      items: { type: 'string', format: 'date' },
    },
    ubicacion: {
      type: 'object',
    },
    usuario_responsable: {
      type: 'integer',
    },
    completado: {
      type: 'boolean',
      default: false,
    },
    tipo: {
      type: 'string',
      enum: ['Rutina'],
      example: 'Rutina',
    },
  },
  additionalProperties: false
};
export const createActividadObjetivoDtoSchema = {
  type: 'object',
  required: ['titulo', 'tipo'],
  properties: {
    titulo: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      example: 'Aprender a atarse los zapatos',
    },
    descripcion: {
      type: 'string',
    },
    color: {
      type: 'string',
    },
    fechas_realizacion: {
      type: 'array',
      items: { type: 'string', format: 'date' },
    },
    ubicacion: {
      type: 'object',
    },
    usuario_responsable: {
      type: 'integer',
    },
    completado: {
      type: 'boolean',
      default: false,
    },
    tipo: {
      type: 'string',
      enum: ['Objetivo'],
      example: 'Objetivo',
    },
    rutina_id: {
      type: ['integer', 'null'],
    },
    dia_semana: {
      type: ['integer', 'null'],
    },
    hora_inicio: {
      type: ['string', 'null'],
      format: 'time',
    },
    hora_fin: {
      type: ['string', 'null'],
      format: 'time',
    },
  },
  additionalProperties: false
};
export const updateActividadDtoSchema = {
  type: 'object',
  properties: {
    titulo: { type: 'string', minLength: 1, maxLength: 100 },
    descripcion: { type: 'string' },
    rutina_id: { type: 'integer' },
    fechas_realizacion: {
      type: 'array',
      items: { type: 'string', format: 'date' },
    },
    dia_semana: { type: 'integer', minimum: 0, maximum: 6 },
    hora_inicio: { type: 'string', format: 'time' },
    hora_fin: { type: 'string', format: 'time' },
    color: { type: 'string' },
    tipo: {
      type: 'string',
      enum: ['Objetivo', 'Rutina', 'Evento'],
    },
    ubicacion: { type: 'object' },
    usuario_responsable: { type: 'integer' },
    completado: { type: 'boolean' },
  },
  additionalProperties: false,
  minProperties: 1
};
