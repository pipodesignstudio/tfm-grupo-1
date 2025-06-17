export const NewRemindedSchema = {
    type: 'object',
    required: ['activityId', 'periodicidad'],
    properties: {
        actividadId: {
            type: 'number',
            description: 'ID de la actividad',
            example: 4
        },
        periodicidad: {
            type: 'string',
            description: 'Frecuencia del recordatorio',
            example: 'daily'
        }
    },
    additionalProperties: false
};
export const UpdateRemindedSchema = {
    type: 'object',
    required: ['id'],
    properties: {
        id: {
            type: 'number',
            description: 'ID de la actividad',
            example: 4
        },
        periodicidad: {
            type: 'string',
            description: 'Frecuencia del recordatorio',
            example: 'daily'
        },
        active: {
            type: 'boolean',
            description: 'Estado del recordatorio',
            example: true
        }
    },
    additionalProperties: false
};