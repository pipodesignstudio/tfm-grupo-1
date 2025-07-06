import prisma from "../config/prisma.config";
import { NewNoteDto, UpdateNoteDto } from "../dtos/notes";
import { InternalServerError, NotFoundError } from "../utils";

export class NotesService {
  /**
   * Crea una nueva nota para un niño específico
   * @param id_nino - ID del niño al que pertenece la nota
   * @param dto - Datos validados para crear la nota
   */
  public async create(id_nino: number, dto: NewNoteDto) {
    try {
      return await prisma.notas.create({
        data: {
          ninos_id: id_nino,
          titulo: dto.titulo,
          texto: dto.texto,
          fecha_creacion: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerError(
        "Error interno al crear la nota",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }

  /**
   * Devuelve todas las notas asociadas a un niño
   * @param id_nino - ID del niño
   */
  public async findAllByNino(id_nino: number) {
    return await prisma.notas.findMany({
      where: { ninos_id: id_nino },
      orderBy: { fecha_creacion: "desc" },
    });
  }

  /**
   * Devuelve una nota específica si pertenece al niño indicado
   * @param id_nino - ID del niño
   * @param id - ID de la nota
   */
  public async findById(id_nino: number, id: number) {
    const nota = await prisma.notas.findFirst({
      where: { id, ninos_id: id_nino },
    });

    if (!nota) {
      throw new NotFoundError(
        "Nota no encontrada",
        { error: "NOTA_NOT_FOUND" },
        false
      );
    }

    return nota;
  }

  /**
   * Actualiza una nota si pertenece al niño
   * @param id_nino - ID del niño
   * @param id - ID de la nota
   * @param dto - Datos a actualizar (pueden ser parciales)
   */
  public async update(id_nino: number, id: number, dto: UpdateNoteDto) {
    const result = await prisma.notas.updateMany({
      where: { id, ninos_id: id_nino },
      data: {
        titulo: dto.titulo,
        texto: dto.texto,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError(
        "Nota no encontrada",
        { error: "NOTA_NOT_FOUND" },
        false
      );
    }

    return;
  }

  /**
   * Elimina una nota si pertenece al niño
   * @param id_nino - ID del niño
   * @param id - ID de la nota
   */
  public async delete(id_nino: number, id: number) {
    const result = await prisma.notas.deleteMany({
      where: { id, ninos_id: id_nino },
    });

    if (result.count === 0) {
      throw new NotFoundError(
        "Nota no encontrada",
        { error: "NOTA_NOT_FOUND" },
        false
      );
    }

    return;
  }
}
