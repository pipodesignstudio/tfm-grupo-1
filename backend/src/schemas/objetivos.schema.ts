export const ObjetivoSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre: { type: 'string', maxLength: 45 },
    color: { type: ['string', 'null'], maxLength: 45 },
    tipo: { type: ['string', 'null'], maxLength: 45 },
    fecha_fin: { type: ['string', 'null'], format: 'date' },
    actividades_ids: {
      type: 'array',
      items: { type: 'integer' },
      description: 'IDs de actividades asociadas',
    }
  },
  additionalProperties: false
};