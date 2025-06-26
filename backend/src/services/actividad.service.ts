import prisma from "../config/prisma.config";
import { ExportActivitiesDto } from "../dtos/actividades";
import { CreateActividadDto } from '../dtos/actividades/create-actividad.dto';
import { UpdateActividadDto } from "../dtos/actividades/update-actividad.dto";
import { IActividad, IActividadPdf } from "../interfaces";
import { activitiesPdfGenerator } from "../templates/pdf/activities-export.layout";
import { NotFoundError, InternalServerError } from '../utils';
import { PdfGeneratorService } from "./printer.service";


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
        ubicacion: dto.ubicacion ?? undefined,
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

  public async exportActivitiesToPdf(dto: ExportActivitiesDto, nino_id: number):Promise<PDFKit.PDFDocument | null> {
    try {
      const nino = await prisma.ninos.findUnique({ where: { id: nino_id } });
      if (!nino) {
        throw new NotFoundError(
          'Nino no encontrado',
          { error: 'NINO_NOT_FOUND' },
          false
        );
      }
      const activitiesPdf = await this.transformActivitiesToPdfDto(dto.activities, `${nino.nombre} ${nino.apellido}`);
      const docDefinitions = activitiesPdfGenerator(activitiesPdf);
      return  this.printerService.createPdf(docDefinitions);
    } catch (error) {
      throw new InternalServerError('Error interno al exportar actividades', {
        error: 'INTERNAL_SERVER_ERROR',
        detalle: error,
      });  
    }
  }


  private async transformActivitiesToPdfDto(actividades: IActividad[], nino_name:string):Promise<IActividadPdf[]> {
    const response:IActividadPdf[] = [];
    actividades.forEach(async (actividad) => {
      let rutina_name = '';
      if (actividad.rutina_id) {
        const rutina = await prisma.rutinas.findUnique({ where: { id: actividad.rutina_id } });
        rutina_name = rutina?.nombre ?? '';
      }
      const pdfactividad:IActividadPdf = {
        rutina_name,
        nino: nino_name,
        title: actividad.titulo ?? '',
        description: actividad.descripcion ?? '',
        fecha_realizacion: actividad.fecha_realizacion ?? new Date(),
        hora_inicio: actividad.hora_inicio,
        hora_fin: actividad.hora_fin,
        color: actividad.color ?? '',
        tipo: actividad.tipo,
      }
      response.push(pdfactividad);
    });
    return response;
  }

}