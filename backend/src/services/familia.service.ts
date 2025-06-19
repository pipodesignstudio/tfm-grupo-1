import prisma from "../config/prisma.config";
import { NewFamiliaDto, UpdateFamiliaDto } from "../dtos/familia";
import { InternalServerError, NotFoundError } from "../utils";

export class FamiliaService {
  /**
   * Crea una nueva familia y la asocia al usuario como admin
   * @param dto - Datos validados para crear la familia
   * @param userId - ID del usuario creador (será admin)
   */
  public async crearFamilia(dto: NewFamiliaDto, userId: number) {
    try {
      // 1. Crear la familia
      const familia = await prisma.familia.create({
        data: {
          descripcion: dto.descripcion,
        },
      });

      // 2. Asociar al usuario como admin de esa familia
      await prisma.familia_usuarios.create({
        data: {
          familia_id: familia.id,
          usuarios_id: userId,
          rol: "admin",
        },
      });

      return familia;
    } catch (error) {
      throw new InternalServerError("Error al crear la familia", {
        error: "INTERNAL_SERVER_ERROR",
      });
    }
  }

  /**
   * Devuelve todas las familias existentes (uso interno o admin)
   */
  public async listarFamilias() {
    return await prisma.familia.findMany();
  }

  /**
   * Devuelve una familia específica por su ID
   * @param id - ID de la familia
   */
  public async obtenerFamilia(id: number) {
    const familia = await prisma.familia.findUnique({
      where: { id },
    });

    if (!familia) {
      throw new NotFoundError("Familia no encontrada", {
        error: "FAMILIA_NOT_FOUND",
      });
    }

    return familia;
  }

  /**
   * Actualiza una familia existente
   * @param id - ID de la familia
   * @param dto - Datos a actualizar
   */
  public async actualizarFamilia(id: number, dto: UpdateFamiliaDto) {
    try {
      const result = await prisma.familia.update({
        where: { id },
        data: {
          descripcion: dto.descripcion,
        },
      });

      return result;
    } catch (error) {
      throw new NotFoundError("Familia no encontrada", {
        error: "FAMILIA_NOT_FOUND",
      });
    }
  }

  /**
   * Elimina una familia por su ID
   * @param id - ID de la familia
   */
  public async borrarFamilia(id: number) {
    const result = await prisma.familia.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundError("Familia no encontrada", {
        error: "FAMILIA_NOT_FOUND",
      });
    }

    return;
  }
}
