import { Request, Response } from 'express';
import { CreateUserDto } from "../dtos";
import { ApiResponse } from "../utils/success-api-response.util";

export class AuthController {
    /**
     * Prueba el flujo de validación de DTOs.
     * Recibe el body validado y lo devuelve como respuesta exitosa.
     * Los errores de validación son gestionados por el `errorHandler` global.
     *
     * @param req El objeto de solicitud de Express.
     * @param res El objeto de respuesta de Express.
     */
    public async register(req: Request, res: Response): Promise<void> {
        const validatedBody: CreateUserDto = req.body;
        ApiResponse.success(res, validatedBody, true, 'Registrado con exito', 200);
    }

}