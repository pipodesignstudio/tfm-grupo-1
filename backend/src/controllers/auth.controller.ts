import { Request, Response } from "express";
import dotenv from "dotenv";

import { LoginUserDto, RegisterUserDto } from "../dtos";

import { ApiCorrectResponse } from "../utils/success-api-response.util";
import { IAuthResponse, IUser } from "../interfaces";
import { AuthService } from "../services";
import { generateJwtToken, logger } from "../utils";

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
    console.log("🚀 Registro de usuario:", req.body);
    logger.logInfo("Registro de usuario: " + JSON.stringify(req.body));
    const dto: RegisterUserDto = req.body;

    const createdUser: IUser = await authService.createUser(dto);
    const jwt = generateJwtToken(createdUser);

    const response: IAuthResponse = {
      user: {
        email: createdUser.email,
        created_at: createdUser.fecha_creacion,
        primera_sesion: createdUser.primera_sesion,
        nombre: createdUser.nombre,
        apellido: createdUser.apellido,
        img_perfil: createdUser.img_perfil,
        nick: createdUser.nick,
      },
      token: {
        expires_in: JWT_EXPIRES_IN as number,
        token: jwt,
      },
    };

    logger.logUserAction(createdUser.id, "REGISTER");

    ApiCorrectResponse.genericSuccess(
      res,
      response,
      true,
      "Registrado con exito",
      200
    );
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
        email: user.email,
        nombre: user.nombre,
        apellido: user.apellido,
        img_perfil: user.img_perfil,
        primera_sesion: user.primera_sesion,
        created_at: user.fecha_creacion,
        nick: user.nick,
      },
      token: {
        expires_in: JWT_EXPIRES_IN as number,
        token: jwt,
      },
    };

    logger.logUserAction(user.id, "LOGIN");

    ApiCorrectResponse.genericSuccess(
      res,
      response,
      true,
      "Inicio de sesión exitoso."
    );
  }
}
