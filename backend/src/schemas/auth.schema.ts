export const RegisterUserDtoSchema = {
  type: 'object',
  required: ['nick', 'email', 'contrasena'],
  properties: {
    nick: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
      description: 'Nick de usuario único',
      example: 'juan_perez',
      pattern: '^[a-zA-Z0-9_]+$' // Opcional: patrón para nick
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'Dirección de correo electrónico válida',
      example: 'juan@example.com'
    },
    contrasena: {
      type: 'string',
      minLength: 8,
      maxLength: 255,
      description: 'Contraseña del usuario (mínimo 8 caracteres)',
      example: 'MiContraseña123!',
    }
  },
  additionalProperties: false
};

export const LoginUserDtoSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      description: 'Dirección de correo electrónico válida',
      example: 'juan@example.com'
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 255,
      description: 'Contraseña del usuario (mínimo 8 caracteres)',
      example: 'MiContraseña123!',
    }
  },
  additionalProperties: false
};