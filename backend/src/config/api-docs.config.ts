import swaggerJsdoc from 'swagger-jsdoc';
import { BadRequestErrorSchema, ConflictErrorSchema, CustomErrorSchema, ForbiddenErrorSchema, InternalServerErrorSchema, InvalidInputErrorSchema, NotFoundErrorSchema, RegisterUserDtoSchema, SuccessApiResponseSchema, UnauthorizedErrorSchema } from '../schemas';

export const schemas = {
  // Auth schemas
  RegisterUserDto: RegisterUserDtoSchema,

  // Error schemas
  CustomError: CustomErrorSchema,
  BadRequestError: BadRequestErrorSchema,
  UnauthorizedError: UnauthorizedErrorSchema,
  ForbiddenError: ForbiddenErrorSchema,
  NotFoundError: NotFoundErrorSchema,
  ConflictError: ConflictErrorSchema,
  InvalidInputError: InvalidInputErrorSchema,
  InternalServerError: InternalServerErrorSchema,
  SuccessResponse: SuccessApiResponseSchema
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
      schemas
    },
  },
   apis: [
    // './src/routes/test.route.ts', // Asegúrate de que apunta a tu archivo de prueba
    './src/routes/**/*.ts',   // Asegúrate de que apunta a tus ARCHIVOS .TS
  ],
};


const apiDocsConfig = swaggerJsdoc(options); 
export default apiDocsConfig; 