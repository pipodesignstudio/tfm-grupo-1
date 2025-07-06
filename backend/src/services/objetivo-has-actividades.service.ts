import prisma from "../config/prisma.config";
import { NewNoteDto, UpdateNoteDto } from "../dtos/notes";
import { InternalServerError, NotFoundError } from "../utils";

export class ObjetivosHasActivities {
  
    /**
     * Crea una nueva relación entre un objetivo y una actividad
     * @param objetivo_id - ID del objetivo
     * @param actividad_id - ID de la actividad
     */
  public async create(objetivo_id: number, actividad_id: number) {
    try {
      return await prisma.objetivos_has_actividades.create({
        data: {
          objetivo_id: objetivo_id,
          actividad_id: actividad_id,
        },
      });
    } catch (error) {
      throw new InternalServerError(
        "Error interno al crear la relación entre objetivo y actividad",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }

    /**
     * Elimina una relación entre un objetivo y una actividad
     * @param objetivo_id - ID del objetivo
     * @param actividad_id - ID de la actividad
     */
  public async delete(objetivo_id: number, actividad_id: number) {
    try {
      return await prisma.objetivos_has_actividades.deleteMany({
        where: {
          objetivo_id: objetivo_id,
          actividad_id: actividad_id,
        },
      });
    } catch (error) {
      throw new InternalServerError(
        "Error interno al eliminar la relación entre objetivo y actividad",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }
}
