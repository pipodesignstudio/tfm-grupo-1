import { IRequestUser, IUser } from "../interfaces";
import prisma from "../config/prisma.config";
import {
  BadRequestError,
  CustomError,
  InternalServerError,
  logger,
  NotFoundError,
} from "../utils";
import { UpdateUserDto } from "../dtos";
import { DebugLogger } from "util";

export class UserService {
  /**
   * Recibe los datos del payload y devuelve la data del usuario sin id ni contraseña
   * @param user Mapa de datos del usuario con email y el ID
   * @returns El usuario omitiendo contraseña y el id o undefined si no lo encuentra
   */
  async getUserByRequest(
    user: IRequestUser
  ): Promise<Omit<IUser, "contrasena" | "id"> | null> {
    try {
      const reqUser = await prisma.usuarios.findUnique({
        where: { id: user.id },
      });
      if (!reqUser) return null;
      const { contrasena, id, ...userWithoutPassword } = reqUser!;
      return userWithoutPassword;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error inesperado en getUserByRequest:", error);
      throw new InternalServerError(
        "Error interno al procesar la solicitud del usuario.",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }

  /**
   * Actualiza las propiedades booleanas del suaurio dependiendo de la accion
   *
   * @param user Mapa de datos del usuario con email y el ID
   * @param action - String que indica la accion a realizar
   * @returns Una promesa que ser resuelve como verdadera si va todo bien
   * @throws {CustomError} Captura posibles errores y los lanza al middleware
   * @throws {InternalServerError} Devuelve un error 500 controlado si no lo localizamos
   */

  async completeUserOnboardingOrVerifyEmail(
    user: IRequestUser,
    action: "complete" | "verify"
  ): Promise<boolean> {
    try {
      await prisma.usuarios.update({
        where: { id: user.id },
        data:
          action === "verify"
            ? { email_verificado: true }
            : { primera_sesion: false },
      });
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error inesperado en completeOnboarding:", error);
      throw new InternalServerError(
        "Error interno al procesar la solicitud del usuario.",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }

  /**
   * Actualiza parcialmente el perfil de un usuario.
   * Solo los campos proporcionados en 'dto' serán modificados.
   * @param userId El ID del usuario a actualizar.
   * @param dto El objeto con los campos a actualizar (opcionales).
   * @returns El usuario actualizado.
   * @throws NotFoundError si el usuario no existe.
   */
  public async updateProfile(
    userId: number,
    dto: UpdateUserDto
  ): Promise<Omit<IUser, "contrasena" | "id">> {
    const updateData: {
      nombre?: string | null;
      apellido?: string | null;
      img_perfil?: Uint8Array | null;
    } = {};

    // Como técnicamente en BBDD puede ser null voy a permitir que pase con undefined
    if (dto.nombre !== undefined) {
      updateData.nombre = dto.nombre;
    }
    if (dto.apellido !== undefined) {
      updateData.apellido = dto.apellido;
    }
    if (dto.img_perfil !== undefined) {
      if (dto.img_perfil === null) {
        updateData.img_perfil = null;
      } else if (typeof dto.img_perfil === "string") {
        try {
          const base64String = dto.img_perfil.split(",")[1] || dto.img_perfil;
          updateData.img_perfil = Buffer.from(base64String, "base64");
        } catch (error) {
          console.error("Error al decodificar imagen Base64:", error);

          const err = new BadRequestError(
            "La imagen de perfil no se ha podido decodificar  ",
            { error: "BAD_REQUEST" }
          );
          const logErrorDetails = {
            message: "Error al decodificar imagen Base64",
            error: error,
          };

          logger.logError(err, undefined, logErrorDetails);

          throw err;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      const existingUser = await prisma.usuarios.findUnique({
        where: { id: userId },
        select: {
          email: true,
          nombre: true,
          apellido: true,
          nick: true,
          img_perfil: true,
          primera_sesion: true,
          fecha_creacion: true,
          borrado: true,
          email_verificado: true,
        },
      });
      if (!existingUser) {
        throw new NotFoundError("Usuario no encontrado.");
      }

      return existingUser!;
    }

    const updatedUser = await prisma.usuarios.update({
      where: { id: userId },
      data: updateData, // Prisma solo aplica las propiedades que están en updateData
      select: {
        email: true,
        nombre: true,
        apellido: true,
        nick: true,
        img_perfil: true,
        primera_sesion: true,
        fecha_creacion: true,
        borrado: true,
        email_verificado: true,
      },
    });

    return updatedUser;
  }

  /**
   * Marca un usuario como borrado (Borrado lógico).
   * @param user El objeto con los datos del usuario a borrar.
   * @returns True si el usuario ha sido marcado como borrado.
   * @throws InternalServerError si hay un problema al intentar borrar el usuario.
   */
  async deleteUser(user: IRequestUser): Promise<boolean> {
    try {
      await prisma.usuarios.update({
        where: { id: user.id },
        data: { borrado: true },
      });
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      console.error("Error inesperado en completeOnboarding:", error);
      throw new InternalServerError(
        "Error interno al procesar la solicitud del usuario.",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }

  // ------------------- MÉTODOS AUXILIARES ------------------------ //

  /**
   * Devuelve una instancia del usuario que hace la petición sin passwrord ni id
   *
   * @param userId Id del usuario
   * @returns El usuario sin password ni id o null si no lo encuentra por cualquier momento
   */

  async getUserById(
    userId: number
  ): Promise<Omit<IUser, "contrasena" | "id"> | null> {
    try {
      const user = await prisma.usuarios.findUnique({
        where: { id: userId },
        select: {
          email: true,
          nombre: true,
          apellido: true,
          nick: true,
          img_perfil: true,
          primera_sesion: true,
          fecha_creacion: true,
          borrado: true,
          email_verificado: true,
        },
      });
      if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
      }
      return user;
    } catch (error) {
      // Nota: este servicio es de uso interno. No necesito lanzar errores
      console.log(error);
      return null;
    }
  }

  async getUserByEmail(
    email: string
  ): Promise<Omit<IUser, "contrasena" | "id"> | null> {
    try {
      const user = await prisma.usuarios.findUnique({
        where: { email: email },
        select: {
          email: true,
          nombre: true,
          apellido: true,
          nick: true,
          img_perfil: true,
          primera_sesion: true,
          fecha_creacion: true,
          borrado: true,
          email_verificado: true,
        },
      });
      if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
      }
      return user;
    } catch (error) {
      // Nota: este servicio es de uso interno. No necesito lanzar errores
      console.log(error);
      return null;
    }
  }


  public async checkIfEmailNeedsToBeVerified(id: number): Promise<boolean> {
    try {
      const user = await prisma.usuarios.findUnique({
        where: { id: id },
        select: {
          email_verificado: true,
        },
      });
      if (!user) {
        throw new NotFoundError("Usuario no encontrado.");
      }
      return user.email_verificado;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Obtener familia de un usuario
   * @param usuarioId - ID del usuario
   */
  public async getAllFamiliasByUsuarioId(usuarioId: number) {
    const familias = await prisma.familia_usuarios.findMany({
      where: { usuarios_id: usuarioId },
      include: {
        familia: {
          select: {
            id: true,
            descripcion: true,
          },
        },
      },
    });

    return familias.map((fu) => ({
      id: fu.familia.id,
      descripcion: fu.familia.descripcion,
      rol: fu.rol,
    }));
  }


}
