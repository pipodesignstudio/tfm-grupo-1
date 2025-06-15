import prisma from "../config/prisma.config";
import { CreateActividadDto } from '../dtos/actividades/create-actividad.dto';
import { UpdateActividadDto } from "../dtos/actividades/update-actividad.dto";
import { NotFoundError, InternalServerError } from '../utils';


export class ActividadService {
  public async createActividadEvento(id_nino: number, dto: CreateActividadDto) {
    try {
      return await prisma.actividades.create({
        data: {
          tipo: 'Evento',
          ninos_id: id_nino,
          titulo: dto.titulo,
          descripcion: dto.descripcion,
          fechas_realizacion: dto.fechas_realizacion,
          hora_inicio: dto.hora_inicio,
          hora_fin: dto.hora_fin,
          color: dto.color,
          ubicacion: dto.ubicacion,
          usuario_responsable: dto.usuario_responsable,
          completado: dto.completado ?? false,
          rutina_id: dto.rutina_id ?? null, // puede ser null
          dia_semana: dto.dia_semana ?? null
        }
      });
    } catch (error) {
      throw new InternalServerError(
        'Error interno al crear el evento',
        { error: 'INTERNAL_SERVER_ERROR', detalle: error }
      );
    }
  }

  public async createActividadRutina(id_nino: number, dto: CreateActividadDto) {
    try {
      return await prisma.actividades.create({
        data: {
          tipo: 'Rutina',
          ninos_id: id_nino,
          rutina_id: dto.rutina_id,
          titulo: dto.titulo,
          descripcion: dto.descripcion,
          dia_semana: dto.dia_semana,
          hora_inicio: dto.hora_inicio,
          hora_fin: dto.hora_fin,
          color: dto.color,
          usuario_responsable: dto.usuario_responsable,
          completado: dto.completado ?? false,
          fechas_realizacion: dto.fechas_realizacion ?? null,
          ubicacion: dto.ubicacion ?? null
        }
      });
    } catch (error) {
      throw new InternalServerError(
        'Error interno al crear la rutina',
        { error: 'INTERNAL_SERVER_ERROR', detalle: error }
      );
    }
  }

  public async createActividadObjetivo(id_nino: number, dto: CreateActividadDto) {
    try {
      return await prisma.actividades.create({
        data: {
          tipo: 'Objetivo',
          ninos_id: id_nino,
          titulo: dto.titulo,
          descripcion: dto.descripcion,
          color: dto.color,
          usuario_responsable: dto.usuario_responsable,
          completado: dto.completado ?? false,
          fechas_realizacion: dto.fechas_realizacion ?? null,
          rutina_id: dto.rutina_id ?? null,
          hora_inicio: dto.hora_inicio ?? null,
          hora_fin: dto.hora_fin ?? null,
          dia_semana: dto.dia_semana ?? null,
          ubicacion: dto.ubicacion ?? null
        }
      });
    } catch (error) {
      throw new InternalServerError(
        'Error interno al crear el objetivo',
        { error: 'INTERNAL_SERVER_ERROR', detalle: error }
      );
    }
  }

  public async findAllByNino(id_nino: number) {
    return await prisma.actividades.findMany({
      where: { ninos_id: id_nino }
    });
  }

  public async update(id_nino: number, id: number, dto: UpdateActividadDto) {
    const result = await prisma.actividades.updateMany({
      where: { id, ninos_id: id_nino },
      data: {
        rutina_id: dto.rutina_id,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        fechas_realizacion: dto.fechas_realizacion,
        dia_semana: dto.dia_semana,
        hora_inicio: dto.hora_inicio,
        hora_fin: dto.hora_fin,
        color: dto.color,
        ubicacion: dto.ubicacion,
        usuario_responsable: dto.usuario_responsable,
        completado: dto.completado,
      }
    });

    if (result.count === 0) {
      throw new NotFoundError(
        'Actividad no encontrada',
        { error: 'ACTIVIDAD_NOT_FOUND' },
        false
      );
    }

    return;
  }

  public async delete(id_nino: number, id: number) {
    const result = await prisma.actividades.deleteMany({
      where: { id, ninos_id: id_nino }
    });

    if (result.count === 0) {
      throw new NotFoundError(
        'Actividad no encontrada',
        { error: 'ACTIVIDAD_NOT_FOUND' },
        false
      );
    }

    return;
  }
}
