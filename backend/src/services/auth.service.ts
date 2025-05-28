import bcrypt from "bcryptjs";
import dotenv from 'dotenv';


import { LoginUserDto, RegisterUserDto } from "../dtos";
import {
  ConflictError,
  CustomError,
  InternalServerError,
  UnauthorizedError,
} from "../utils";
import prisma from "../config/prisma.config";
import { IUser } from "../interfaces";
import { EmailService } from "./email.service";

const emailService = new EmailService();
dotenv.config();

export class AuthService {

  /**
   * Crea un nuevo usuario sin relaciones familiares.
   *
   * @param dto Los datos del usuario a crear, provenientes del DTO validado.
   * @returns El objeto de usuario creado (sin la contraseña).
   * @throws {ConflictError} Si el email ya existe.
   * @throws {InternalServerError} Para otros errores inesperados de la base de datos.
   */
    public async createUser(dto: RegisterUserDto): Promise<IUser> {
    try {

      // 1. Verificar si el email ya existe
      const existingUser = await prisma.usuarios.findUnique({
        where: { email: dto.email, id: dto.familyId },
      });

      if (existingUser) {
        throw new ConflictError("El usuario ya está registrado, por favor inicie sesión.", {
          error: "EMAIL_IN_USE",
        });
      }

      // 2. Hashear la contraseña antes de guardarla en la base de datos
      const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

      // 3. Insertar el nuevo usuario en la base de datos
      const newUser: IUser = await prisma.usuarios.create({
        data: {
          email: dto.email,
          contrasena: hashedPassword,
          nick: dto.nick,
          primera_sesion: true,
          fecha_creacion: new Date(),
        },
      });

      const _baseurl = process.env.FRONTEND_URL || "http://localhost:3000";
      const url = `${_baseurl}/auth/verificar/${newUser.id}`;
      await emailService.sendWelcomeVerificationEmail(
        dto.email,
        dto.nick,
        url
      );


      return newUser;
    } catch (error: any) {
      if (error instanceof CustomError) {
        throw error;
      }

      console.error("Error en UserService.createUser:", error);
      throw new InternalServerError(
        "Hubo un problema al registrar el usuario."
      );
    }
  }


  /**
   * Autentica un usuario verificando sus credenciales.
   *
   * @param dto Dto con las credenciales del usuario
   * @returns La interfaz del usuario de usuario si las credenciales son válidas.
   * @throws {UnauthorizedError} Si las credenciales son incorrectas o el usuario no existe.
   * @throws {InternalServerError} Para otros errores inesperados de la base de datos.
   */
  public async loginUser(dto: LoginUserDto): Promise<IUser> {
    try {
      // 1. Buscar al usuario por email
      const user = await prisma.usuarios.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        throw new UnauthorizedError("Credenciales incorrectas.");
      }

      // 2. Comparar la contraseña proporcionada con la contraseña hasheada en la BBDD
      const isPasswordValid = await bcrypt.compare(
        dto.password,
        user.contrasena
      );

      if (!isPasswordValid) {
        console.log("Contraseña incorrecta");
        throw new UnauthorizedError(
          "Credenciales incorrectas.",
          { error: "WRONG_PASSWORD" },
          false
        );
      }

      // 3. Si todo es correcto, devolver el objeto de usuario.
      return user;
    } catch (error: any) {
      if (error instanceof CustomError) {
         throw error;
      } else {
          throw new InternalServerError(
            "Hubo un problema al intentar iniciar sesión."
          );
      }
    }
  }

  // TODO: Implementar la funcionalidad de autenticación de usuarios cuando viene de una familia

}
