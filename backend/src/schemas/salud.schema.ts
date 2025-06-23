export const CreateAlergiaDtoSchema = {
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

export const CreateEnfermedadDtoSchema = {
  type: 'object',
  required: ['nombre', 'doctor'],
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la enfermedad',
      example: 'Gripe',
    },
    doctor: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre del doctor',
      example: 'Dr. Juan Pérez',
    }
  },
  additionalProperties: false
};

export const UpdateEnfermedadDtoSchema = {
  type: 'object',
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nuevo nombre de la enfermedad',
      example: 'Gripe',
    },
    doctor: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nuevo nombre del doctor',
      example: 'Dr. Juan Pérez',
    }
  },
  additionalProperties: false,
  minProperties: 1
};  

export const CreateVacunaDtoSchema = {
  type: 'object',
  required: ['nombre', 'fecha'],
  properties: {
    nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nombre de la vacuna',
      example: 'Gripe',
    },
    fecha: {
      type: 'Date',
      description: 'Fecha de la vacuna',
      example: '2022-01-01',
    }
  },
  additionalProperties: false
};

export const UpdateVacunaDtoSchema = {
  type: 'object',
  properties: {
      nombre: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
      description: 'Nuevo nombre de la vacuna',
      example: 'Gripe',
    },
    fecha: {
      type: 'Date',
      description: 'Fecha de la vacuna',
      example: '2022-01-01',
    }
  },
  additionalProperties: false,
  minProperties: 1
};