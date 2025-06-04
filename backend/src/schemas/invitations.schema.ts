export const NewInvitationSchema = {
    type: 'object',
    required: ['destinationEmail', 'familyId', 'role'],
    properties: {
        email: {
            type: 'string',
            format: 'email',
            description: 'Dirección de correo electrónico del invitado',
            example: 'juan@example.com'
        },
        familyId: {
            type: 'number',
            description: 'ID de familia',
            example: 4
        },
        role: {
            type: 'string',
            description: 'Rol del invitado',
            example: 'admin'
        }
    },
    additionalProperties: false
};

export const InvitationResponseSchema = {
    type: 'object',
    invitationId: {
        id: {
            type: 'number',
            description: 'ID de la invitación',
            example: 1
        },
        isAccepted: {
            type: 'boolean',
            description: 'Estado de la invitación',
            example: true
        }
    },
    additionalProperties: false
};