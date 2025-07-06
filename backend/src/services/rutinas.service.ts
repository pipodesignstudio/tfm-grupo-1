import prisma from '../config/prisma.config';
import { CreateRutinaDto } from '../dtos/rutinas/create-rutina.dto';
import { UpdateRutinaDto } from '../dtos/rutinas/update-rutina.dto';
import { NotFoundError, InternalServerError } from '../utils';

export class RutinasService {
  async create(id_nino: number, dto: CreateRutinaDto) {
    try {
      const data: any = {
        ninos_id: id_nino,
        nombre: dto.nombre,
        descripcion: dto.descripcion ?? undefined,
        frecuencia: dto.frecuencia ?? undefined,
        fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : undefined,
      };

      return await prisma.$transaction(async (tx) => {
        const rutina = await tx.rutinas.create({ data });

        if (dto.actividades_ids?.length) {
          await tx.actividades.updateMany({
            where: { id: { in: dto.actividades_ids } },
            data: { rutina_id: rutina.id },
          });
        }

        return { success: true, message: 'Rutina creada con éxito', data: rutina };
      });
    } catch (error) {
      throw new InternalServerError('Error al crear rutina', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  async findAllByNino(id_nino: number) {
    const rutinas = await prisma.rutinas.findMany({
      where: { ninos_id: id_nino },
      include: { actividades: true },
    });
    return { success: true, message: 'Listado de rutinas', data: rutinas };
  }

  async update(id_nino: number, id: number, dto: UpdateRutinaDto) {
  try {
    return await prisma.$transaction(async (tx) => {
      const baseData: any = {};
      if (dto.nombre !== undefined) baseData.nombre = dto.nombre;
      if (dto.descripcion !== undefined) baseData.descripcion = dto.descripcion;
      if (dto.frecuencia !== undefined) baseData.frecuencia = dto.frecuencia;
      if (dto.fecha_fin !== undefined) baseData.fecha_fin = dto.fecha_fin ? new Date(dto.fecha_fin) : null;

      const r = await tx.rutinas.updateMany({ where: { id, ninos_id: id_nino }, data: baseData });
      if (r.count === 0)
        throw new NotFoundError('Rutina no encontrada', { error: 'RUTINA_NOT_FOUND' }, false);

      if (dto.actividades_ids !== undefined) {
        await tx.actividades.updateMany({
          where: { rutina_id: id },
          data: { rutina_id: null },
        });

        if (dto.actividades_ids?.length) {
          await tx.actividades.updateMany({
            where: { id: { in: dto.actividades_ids } },
            data: { rutina_id: id },
          });
        }
      }

      return { success: true, message: 'Rutina actualizada con éxito' };
    });
  } catch (error) {
    throw new InternalServerError('Error al actualizar rutina', { error: 'INTERNAL_SERVER_ERROR' });
  }
}


  async delete(id_nino: number, id: number) {
    return await prisma.$transaction(async (tx) => {
      await tx.actividades.updateMany({
        where: { rutina_id: id },
        data: { rutina_id: null },
      });

      const r = await tx.rutinas.deleteMany({ where: { id, ninos_id: id_nino } });
      if (r.count === 0) throw new NotFoundError('Rutina no encontrada', { error: 'RUTINA_NOT_FOUND' }, false);

      return { success: true, message: 'Rutina eliminada con éxito' };
    });
  }
}
