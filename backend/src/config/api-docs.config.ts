import swaggerJsdoc from 'swagger-jsdoc';
import { BadRequestErrorSchema, ConflictErrorSchema, CreateAlergiaDtoSchema, CreateEnfermedadDtoSchema, CreateNinoSchema, CreateVacunaDtoSchema, CustomErrorSchema, ExportActivitiesDtoSchema, ForbiddenErrorSchema, InternalServerErrorSchema, InvalidInputErrorSchema, InvitationResponseSchema, NewInvitationSchema, NewRemindedSchema, NotFoundErrorSchema, RegisterUserDtoSchema, SuccessApiResponseSchema, SuggestionApiResponseSchema, UnauthorizedErrorSchema, UpdateAlergiaDtoSchema, UpdateEnfermedadDtoSchema, UpdateRemindedSchema, UpdateUserDtoSchema, UpdateVacunaDtoSchema, UserApiResponseSchema } from '../schemas';

export const schemas = {
  // Dto
  RegisterUserDto: RegisterUserDtoSchema,
  UpdateUserDto: UpdateUserDtoSchema,
  NewInvitationDto: NewInvitationSchema,
  InvitationResponseDto: InvitationResponseSchema,
  NewReminderDto: NewRemindedSchema,
  UpdateReminderDto: UpdateRemindedSchema,
  CreateNinoDto: CreateNinoSchema,
  CreateAlergiaDto: CreateAlergiaDtoSchema,
  UpdateAlergiaDto: UpdateAlergiaDtoSchema,
  CreateEnfermedadDto: CreateEnfermedadDtoSchema,
  UpdateEnfermedadDto: UpdateEnfermedadDtoSchema,
  CreateVacunaDto: CreateVacunaDtoSchema,
  UpdateVacunaDto: UpdateVacunaDtoSchema,
  ExportActivitiesDto: ExportActivitiesDtoSchema,

  // Error schemas
  CustomError: CustomErrorSchema,
  BadRequestError: BadRequestErrorSchema,
  UnauthorizedError: UnauthorizedErrorSchema,
  ForbiddenError: ForbiddenErrorSchema,
  NotFoundError: NotFoundErrorSchema,
  ConflictError: ConflictErrorSchema,
  InvalidInputError: InvalidInputErrorSchema,
  InternalServerError: InternalServerErrorSchema,

  // Acierto
  SuccessResponse: SuccessApiResponseSchema,
  UserSuccessResponse: UserApiResponseSchema,
  SuggestionsSuccessSchema: SuggestionApiResponseSchema
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Nido',
      version: '1.0.0',
      description: 'Documentación de la API de Nido',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: `Autenticación JWT.
El token debe ser enviado en el encabezado 'Authorization' como 'Bearer <token>'`,
        },
      },
      schemas
    },
  },
   apis: [
    './src/routes/**/*.ts', 
  ],
};


const apiDocsConfig = swaggerJsdoc(options); 
export default apiDocsConfig; 