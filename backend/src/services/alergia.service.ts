import prisma from "../config/prisma.config";
import { CreateAlergiaDto } from '../dtos/alergias/create-alergia.dto';
import { UpdateAlergiaDto } from '../dtos/alergias/update-alergia.dto';
import { NotFoundError, InternalServerError } from '../utils';

export class AlergiaService {
  public async create(id_nino: number, dto: CreateAlergiaDto) {
    try {
      return await prisma.alergias.create({
        data: { nombre: dto.nombre, ninos_id: id_nino }
      });
    } catch (error) {
      throw new InternalServerError(
        'Error interno al crear la alergia',
        { error: 'INTERNAL_SERVER_ERROR' }
      );
    }
  }

  public async findAllByNino(id_nino: number) {
    return await prisma.alergias.findMany({ where: { ninos_id: id_nino } });
  }

  public async update(id_nino: number, id: number, dto: UpdateAlergiaDto) {
    const result = await prisma.alergias.updateMany({
      where: { id, ninos_id: id_nino },
      data: { nombre: dto.nombre! }
    });
    if (result.count === 0) {
      throw new NotFoundError(
        'Alergia no encontrada',
        { error: 'ALERGIA_NOT_FOUND' },
        false
      );
    }
    return;
  }

  public async delete(id_nino: number, id: number) {
    const result = await prisma.alergias.deleteMany({ where: { id, ninos_id: id_nino } });
    if (result.count === 0) {
      throw new NotFoundError(
        'Alergia no encontrada',
        { error: 'ALERGIA_NOT_FOUND' },
        false
      );
    }
    return;
  }
}