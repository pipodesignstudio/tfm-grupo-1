import prisma from '../config/prisma.config';
import { CreateObjetivoDto } from '../dtos/objetivos/create-objetivo.dto';
import { UpdateObjetivoDto } from '../dtos/objetivos/update-objetivo.dto';
import { NotFoundError, InternalServerError } from '../utils';

export class ObjetivosService {
  /* CREATE */
  async create(id_nino: number, dto: CreateObjetivoDto) {
    try {
      const data: any = {
        nombre: dto.nombre,
        ninos_id: id_nino,
        color: dto.color ?? undefined,
        tipo: dto.tipo ?? undefined,
        fecha_fin: dto.fecha_fin ? new Date(dto.fecha_fin) : undefined,
      };

      return await prisma.$transaction(async (tx) => {
        const objetivo = await tx.objetivos.create({ data });

        if (dto.actividades_ids && dto.actividades_ids.length) {
          await tx.objetivos_has_actividades.createMany({
            data: dto.actividades_ids.map((actividad_id) => ({
              actividad_id,
              objetivo_id: objetivo.id,
            })),
            skipDuplicates: true,
          });
        }

        return { success: true, message: 'Objetivo creado con éxito', data: objetivo };
      });
    } catch (error) {
      throw new InternalServerError('Error al crear objetivo', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  /* LIST */
  async findAllByNino(id_nino: number) {
    const objetivos = await prisma.objetivos.findMany({
      where: { ninos_id: id_nino },
      include: { objetivos_has_actividades: { select: { actividad_id: true } } },
    });
    return { success: true, message: 'Listado de objetivos', data: objetivos };
  }

  /* UPDATE */
  async update(id_nino: number, id: number, dto: UpdateObjetivoDto) {
    try {
      return await prisma.$transaction(async (tx) => {
        const baseData: any = {};
        if (dto.nombre !== undefined) baseData.nombre = dto.nombre;
        if (dto.color !== undefined) baseData.color = dto.color;
        if (dto.tipo !== undefined) baseData.tipo = dto.tipo;
        if (dto.fecha_fin !== undefined)
          baseData.fecha_fin = dto.fecha_fin ? new Date(dto.fecha_fin) : null;

        /* ------------- actualizar campos escalares si los hay ------------- */
        let affectedRows = 0;
        if (Object.keys(baseData).length) {
          const r = await tx.objetivos.updateMany({ where: { id, ninos_id: id_nino }, data: baseData });
          affectedRows = r.count;
        } else {
          // Si no hay cambios escalares, al menos comprobamos que exista el objetivo
          affectedRows = await tx.objetivos.count({ where: { id, ninos_id: id_nino } });
        }

        if (affectedRows === 0)
          throw new NotFoundError('Objetivo no encontrado', { error: 'OBJETIVO_NOT_FOUND' }, false);

        /* ------------- sincronizar actividades ------------- */
        if (dto.actividades_ids !== undefined) {
          await tx.objetivos_has_actividades.deleteMany({ where: { objetivo_id: id } });
          if (dto.actividades_ids && dto.actividades_ids.length) {
            await tx.objetivos_has_actividades.createMany({
              data: dto.actividades_ids.map((actividad_id) => ({ actividad_id, objetivo_id: id })),
              skipDuplicates: true,
            });
          }
        }

        return { success: true, message: 'Objetivo actualizado con éxito' };
      });
    } catch (error) {
      console.error('Error real al actualizar objetivo:', error);
      throw new InternalServerError('Error al actualizar objetivo', { error: 'INTERNAL_SERVER_ERROR' });
    }
  }

  /* DELETE */
  async delete(id_nino: number, id: number) {
    return await prisma.$transaction(async (tx) => {
      await tx.objetivos_has_actividades.deleteMany({ where: { objetivo_id: id } });
      const r = await tx.objetivos.deleteMany({ where: { id, ninos_id: id_nino } });
      if (r.count === 0)
        throw new NotFoundError('Objetivo no encontrado', { error: 'OBJETIVO_NOT_FOUND' }, false);
      return { success: true, message: 'Objetivo eliminado con éxito' };
    });
  }
}
