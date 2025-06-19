export const RutinaSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre:  { type: 'string',  maxLength: 100 },
    descripcion:  { type: ['string', 'null'] },
    frecuencia:   {                                         // JSON libre (ej. { lunes:true, … })
      type:  ['object', 'array', 'null'],                  // acepta objeto o array, o null
      description: 'Objeto/array con la configuración de frecuencia',
      additionalProperties: true
    },
    fecha_fin:   { type: ['string', 'null'], format: 'date' },

    /* IDs de actividades que se vincularán a la rutina */
    actividades_ids: {
      type:  'array',
      items: { type: 'integer' },
      description: 'IDs de actividades asociadas'
    }
  },
  additionalProperties: false
};
