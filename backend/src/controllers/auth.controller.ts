import { Request, Response } from "express";
import dotenv from "dotenv";

import { LoginUserDto, RegisterUserDto } from "../dtos";
import { ApiResponse } from "../utils/success-api-response.util";
import { IAuthResponse, IUser } from "../interfaces";
import { AuthService } from "../services";
import { generateJwtToken } from "../utils";

dotenv.config();

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 3600;

const authService = new AuthService();

export class AuthController {
  /**
   * Registra al usuario en la base de datos con password hasheado y genera un JWT.
   *
   * @param req Dto validado por el middleware.
   * @param res Respuesta con datos básicos del user y un jwt
   */

  public async register(req: Request, res: Response): Promise<void> {
    const dto: RegisterUserDto = req.body;

    const createdUser: IUser = await authService.createUser(dto);
    const jwt = generateJwtToken(createdUser);

    const response: IAuthResponse = {
      user: {
        email: createdUser.email,
        created_at: createdUser.fecha_creacion,
      },
      token: {
        expires_in: JWT_EXPIRES_IN as number,
        token: jwt,
      },
    };

    ApiResponse.success(res, response, true, "Registrado con exito", 200);
  }

  /**
   * Maneja el inicio de sesión de un usuario y genera un JWT si las credenciales son válidas.
   *
   * @param req dto del tipo LoginUserDto
   * @param res Respuesta con el JWT del user si las credenciales son correctas.
   */
  public async login(req: Request, res: Response): Promise<void> {
    const dto: LoginUserDto = req.body;

    const user: IUser = await authService.loginUser(dto);
    const jwt = generateJwtToken(user);

    const response: IAuthResponse = {
      user: {
        email: dto.email,
      },
      token: {
        expires_in: JWT_EXPIRES_IN as number,
        token: jwt,
      },
    };

    ApiResponse.success(res, response, true, "Inicio de sesión exitoso.");
  }
}

