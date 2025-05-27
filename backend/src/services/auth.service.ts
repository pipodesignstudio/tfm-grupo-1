import bcrypt from "bcryptjs";

import { LoginUserDto, RegisterUserDto } from "../dtos";
import {
  ConflictError,
  CustomError,
  InternalServerError,
  UnauthorizedError,
} from "../utils";
import prisma from "../config/prisma.config";
import { IUser } from "../interfaces";

export class AuthService {

  
  /**
   * Registra un nuevo usuario en la base de datos.
   *
   * Si el usuario se registra con una invitación, se intenta loggear al usuario
   * correspondiente. De lo contrario, crea un nuevo usuario. Si el email ya existe,
   * lanza un error 409.
   *
   * @param dto Los datos del usuario a registrar, provenientes del DTO validado.
   * @returns El objeto de usuario creado (sin la contraseña) o el usuario logeado
   *          si se proporciona un ID de usuario.
   * @throws {InternalServerError} Para otros errores inesperados de la base de datos.
   */
  public async registerUserService(dto: RegisterUserDto): Promise<any> {
    // Si viene con una invitación
    if(dto.familyId) {
      
    } else {
      return await this.createUser(dto);
    }
  }

  /**
   * Crea un nuevo usuario sin relaciones familiares.
   *
   * @param dto Los datos del usuario a crear, provenientes del DTO validado.
   * @returns El objeto de usuario creado (sin la contraseña).
   * @throws {ConflictError} Si el email ya existe.
   * @throws {InternalServerError} Para otros errores inesperados de la base de datos.
   */
  private async createUser(dto: RegisterUserDto): Promise<IUser> {
    try {

      // 1. Verificar si el email ya existe
      const existingUser = await prisma.usuarios.findUnique({
        where: { email: dto.email },
      });

      // Si se proporciona un ID y el usuario ya existe intentamos loggear
      if (dto.familyId && existingUser) {
        
      }

      if (existingUser) {
        throw new ConflictError("El email ya está registrado.");
      }

      // 2. Hashear la contraseña antes de guardarla en la base de datos
      const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

      // 3. Insertar el nuevo usuario en la base de datos
      const newUser: IUser = await prisma.usuarios.create({
        data: {
          email: dto.email,
          contrasena: hashedPassword,
          nick: 'Hola mundo',
          primera_sesion: true,
          fecha_creacion: new Date(),
        },
      });

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
          { error: "Contraseña incorrecta" },
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

}
