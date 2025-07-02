import prisma from "../config/prisma.config";
import { ExportActivitiesDto } from "../dtos/actividades";
import { CreateActividadDto } from '../dtos/actividades/create-actividad.dto';
import { UpdateActividadDto } from "../dtos/actividades/update-actividad.dto";
import { IActividad, IActividadPdf } from "../interfaces";
import { activitiesPdfGenerator } from "../templates/pdf/activities-export.layout";
import { NotFoundError, InternalServerError } from '../utils';
import { PdfGeneratorService } from "./printer.service";

import { Prisma } from '@prisma/client';



export class ActividadService {

  private printerService: PdfGeneratorService;

  constructor() {
    this.printerService = new PdfGeneratorService();
  }

  public async createActividad(id_nino: number, dto: CreateActividadDto) {
    try {
      const data: any = {
        tipo: dto.tipo,
        ninos_id: id_nino,
        titulo: dto.titulo ?? undefined,
        descripcion: dto.descripcion ?? undefined,
        fecha_realizacion: dto.fecha_realizacion ?? undefined,
        hora_inicio: dto.hora_inicio ?? undefined,
        hora_fin: dto.hora_fin ?? undefined,
        color: dto.color ?? undefined,
        ubicacion: dto.ubicacion ?? undefined,
        usuario_responsable: dto.usuario_responsable ?? undefined,
        completado: dto.completado ?? false,
      };

      if (dto.rutina_id != null) {
        data.rutina_id = dto.rutina_id;
      }

      return await prisma.actividades.create({ data });
    } catch (error) {
      throw new InternalServerError('Error interno al crear el evento', {
        error: 'INTERNAL_SERVER_ERROR',
        detalle: error,
      });
    }
  }



  public async getAllActivitiesByNino(id_nino: number) {
    return await prisma.actividades.findMany({
      where: { ninos_id: id_nino }
    });
  }

  public async getAllActivitiesByFamily(id_familia: number) {
    return await prisma.actividades.findMany({
      where: {
        ninos: {
          familia_id: id_familia
        },
        rutina_id: null // Filtrar actividades que no pertenecen a una rutina
      }
    });
  }
  public async updateActividad(id_nino: number, id: number, dto: UpdateActividadDto) {
    const result = await prisma.actividades.updateMany({
      where: { id, ninos_id: id_nino },
      data: {
        tipo: dto.tipo, // Asignar tipo por defecto si no se proporciona
        rutina_id: dto.rutina_id ?? undefined, // puede ser null
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        fecha_realizacion: dto.fecha_realizacion ?? undefined,
        hora_inicio: dto.hora_inicio,
        hora_fin: dto.hora_fin,
        color: dto.color,
        ubicacion: dto.ubicacion ? JSON.parse(JSON.stringify(dto.ubicacion)) : Prisma.JsonNull,
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

  public async deleteActividad(id_nino: number, id: number) {
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

  public async exportActivitiesToPdf(
    dto: ExportActivitiesDto,
  ): Promise<PDFKit.PDFDocument> {
    const actividades = await prisma.actividades.findMany({
      where: { id: { in: dto.activityIds } },
      include: {
        rutinas: { select: { nombre: true } },
        ninos:   { select: { nombre: true } },
      },
    });
  
    if (actividades.length !== dto.activityIds.length) {
      throw new NotFoundError('Algunas actividades no encontradas', {
        error: 'ACTIVIDADES_NOT_FOUND',
      });
    }
  
    const responsableIds = [
      ...new Set(actividades.map(a => a.usuario_responsable)),
    ];
    const responsables = await prisma.usuarios.findMany({
      where: { id: { in: responsableIds } },
      select: { id: true, nombre: true },
    });
    const responsablesMap = new Map(
      responsables.map(r => [r.id, r.nombre ?? '']),
    );
  
    const actividadesPdf: IActividadPdf[] = actividades.map(a => ({
      rutina_name:       a.rutinas?.nombre ?? '',
      nino:              a.ninos?.nombre   ?? '',
      responsable:       responsablesMap.get(a.usuario_responsable) ?? '',
      title:             a.titulo ?? '',
      description:       a.descripcion ?? '',
      fecha_realizacion: a.fecha_realizacion,
      hora_inicio:       a.hora_inicio,
      hora_fin:          a.hora_fin,
      color:             a.color ?? '',
      tipo:              a.tipo,
    })) satisfies IActividadPdf[];
  
    const docDef = activitiesPdfGenerator(actividadesPdf);
    return this.printerService.createPdf(docDef);
  }
  async validateExportRequest(activityIds: number[], user_id: number): Promise<boolean> {
    const rows = await prisma.actividades.findMany({
      where: { id: { in: activityIds } },
      select: { ninos_id: true },
    });
    if (rows.length !== activityIds.length) return false;   
  
    const childIds = [...new Set(rows.map(r => r.ninos_id))];
  
    const familiaIds = await prisma.familia_usuarios.findMany({
      where: { usuarios_id: user_id },
      select: { familia_id: true },
    }).then(f => f.map(x => x.familia_id));
  
    if (!familiaIds.length) return false;
  
    const cnt = await prisma.ninos.count({
      where: { id: { in: childIds }, familia_id: { in: familiaIds } },
    });
  
    return cnt === childIds.length;
  }

  async getAllActivitiesFromArray(
    activityIds: number[]): Promise<IActividad[]> {
    const actividades = await prisma.actividades.findMany({
      where: { id: { in: activityIds } },
    });

    return actividades;

  }
}