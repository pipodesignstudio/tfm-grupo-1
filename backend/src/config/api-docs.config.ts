import swaggerJsdoc from 'swagger-jsdoc';
import { BadRequestErrorSchema, ConflictErrorSchema, CustomErrorSchema, ForbiddenErrorSchema, InternalServerErrorSchema, InvalidInputErrorSchema, NotFoundErrorSchema, RegisterUserDtoSchema, SuccessApiResponseSchema, UnauthorizedErrorSchema, UpdateUserDtoSchema, UserApiResponseSchema } from '../schemas';
import { UpdateUserDto } from '../dtos';

export const schemas = {
  // Dto
  RegisterUserDto: RegisterUserDtoSchema,
  UpdateUserDto: UpdateUserDtoSchema,

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
  UserSuccessResponse: UserApiResponseSchema
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