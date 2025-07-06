import bcrypt from "bcryptjs";
import dotenv from 'dotenv';


import { LoginUserDto, RegisterUserDto } from "../dtos";
import {
  BadRequestError,
  ConflictError,
  CustomError,
  InternalServerError,
  logger,
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
    const { email, nick } = dto;

    try {
      console.log(`🔍 Verificando usuario existente - Email: ${email.trim().toLowerCase()}, Nick: ${nick.trim().toLowerCase()}`);

      const existingUser = await prisma.usuarios.findFirst({
        where: {
          AND: [
            { borrado: false }, 
            {
              OR: [
                { email: email.trim().toLowerCase() },
                { nick: nick.trim().toLowerCase() }
              ]
            }
          ]
        },
      });

      if (existingUser) {
        console.log(`❌ Usuario existente encontrado:`, {
          id: existingUser.id,
          email: existingUser.email,
          nick: existingUser.nick,
          inputEmail: email.trim().toLowerCase(),
          inputNick: nick.trim().toLowerCase()
        });

        const field = existingUser.email === email.trim().toLowerCase() ? "correo" : "nick";
        throw new ConflictError(`El ${field} ya está registrado, por favor inicie sesión.`, {
          error: "EMAIL_IN_USE",
        });
      }

      console.log(`✅ No se encontró usuario existente, procediendo con la creación`);

      const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

      console.log(`🔐 Creando usuario en base de datos...`);
      const newUser = await prisma.usuarios.create({
        data: {
          email: email.trim().toLowerCase(),
          contrasena: hashedPassword,
          nick: nick.trim().toLowerCase(),
          primera_sesion: true,
          fecha_creacion: new Date(),
          borrado: false,
          email_verificado: false,
          img_perfil: null,
        },
      });

      console.log(`✅ Usuario creado exitosamente con ID: ${newUser.id}`);

      const _baseurl = process.env.FRONTEND_URL || "http://localhost:4200";
      const url = `${_baseurl}/auth/verificar/${newUser.email}`;

      try {
        await emailService.sendWelcomeVerificationEmail(dto.email, dto.nick, url);
      } catch (e) {
        console.warn("Fallo al enviar email de bienvenida:", e);
        logger.logError("Fallo al enviar email de bienvenida:" + e);
      }

      logger.logInfo("Usuario registrado con éxito " + dto.email);
      return newUser;

    } catch (error: any) {
      if (error instanceof CustomError) throw error;

      // Manejo específico del error de constraint único de Prisma
      if (error.code === 'P2002') {
        console.log("❌ Error P2002 - Constraint único violado:", {
          code: error.code,
          message: error.message,
          meta: error.meta,
          inputData: { email: email.trim().toLowerCase(), nick: nick.trim().toLowerCase() }
        });

        // Intentar determinar qué campo causó el conflicto
        let field = 'usuario'; // valor por defecto genérico

        if (error.meta?.target) {
          if (Array.isArray(error.meta.target)) {
            field = error.meta.target.includes('nick') ? 'nick' :
              error.meta.target.includes('email') ? 'correo' : 'usuario';
          } else if (typeof error.meta.target === 'string') {
            field = error.meta.target.includes('nick') ? 'nick' :
              error.meta.target.includes('email') ? 'correo' : 'usuario';
          }
        } else if (error.message) {
          // Fallback: buscar en el mensaje de error
          if (error.message.includes('nick')) {
            field = 'nick';
          } else if (error.message.includes('email')) {
            field = 'correo';
          }
        }

        throw new ConflictError(`El ${field} ya está registrado, por favor inicie sesión.`, {
          error: "DUPLICATE_USER",
        });
      }

      console.error("Error en UserService.createUser:", error);
      logger.logError("Error en UserService.createUser:");
      throw new InternalServerError("Hubo un problema al registrar el usuario.", {
        error: error instanceof Error ? error.message : String(error),
      });
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
        throw new BadRequestError("Usuario no encontrado en la base de datos.", {
          error: "USER_NOT_FOUND",
        });
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
