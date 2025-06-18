export const NinoSchema = {
  type: 'object',
  required: ['perfiles_aprendizaje_id', 'familia_id', 'nombre', 'apellido', 'fecha_nacimiento'],
  properties: {
    perfiles_aprendizaje_id: { type: 'integer' },
    familia_id: { type: 'integer' },
    nombre: { type: 'string', maxLength: 100 },
    apellido: { type: 'string', maxLength: 100 },
    fecha_nacimiento: { type: 'string', format: 'date' },
    descripcion: { type: ['string', 'null'] },
    genero: { type: ['string', 'null'] },
    peso: { type: ['integer', 'null'], minimum: 0 },
    altura: { type: ['integer', 'null'], minimum: 0 },
    img_perfil: { type: ['string', 'null'], description: 'Base64' }
  },
  additionalProperties: false
};