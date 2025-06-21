import prisma from "../config/prisma.config";
import { AddUsuarioFamiliaDto, UpdateRolUsuarioDto } from "../dtos/familia-usuarios";
import { NotFoundError, InternalServerError } from "../utils";

export class FamiliaUsuariosService {
  /**
   * Listar todos los usuarios de una familia
   * @param familiaId - ID de la familia
   */
  public async listarUsuariosDeFamilia(familiaId: number) {
    return await prisma.familia_usuarios.findMany({
      where: { familia_id: familiaId },
      include: { usuarios: true },
    });
  }

  /**
   * Añadir un usuario a una familia con un rol
   * @param familiaId - ID de la familia
   * @param dto - ID del usuario y rol
   */
  public async agregarUsuarioAFamilia(familiaId: number, dto: AddUsuarioFamiliaDto) {
    try {
      return await prisma.familia_usuarios.create({
        data: {
          familia_id: familiaId,
          usuarios_id: dto.usuarios_id,
          rol: dto.rol,
        },
      });
    } catch (error) {
      throw new InternalServerError("Error al añadir usuario a la familia", {
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  /**
   * Actualizar el rol de un usuario dentro de una familia
   * @param familiaId - ID de la familia
   * @param usuarioId - ID del usuario
   * @param dto - Nuevo rol
   */
  public async actualizarRolUsuario(familiaId: number, usuarioId: number, dto: UpdateRolUsuarioDto) {
    const result = await prisma.familia_usuarios.updateMany({
      where: {
        familia_id: familiaId,
        usuarios_id: usuarioId,
      },
      data: {
        rol: dto.rol,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Usuario no encontrado en la familia", {
        error: "FAMILIA_USUARIO_NOT_FOUND",
      });
    }
  }

  /**
   * Eliminar un usuario de una familia
   * @param familiaId - ID de la familia
   * @param usuarioId - ID del usuario
   */
  public async eliminarUsuarioDeFamilia(familiaId: number, usuarioId: number) {
    const result = await prisma.familia_usuarios.deleteMany({
      where: {
        familia_id: familiaId,
        usuarios_id: usuarioId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Usuario no encontrado en la familia", {
        error: "FAMILIA_USUARIO_NOT_FOUND",
      });
    }
  }
}
