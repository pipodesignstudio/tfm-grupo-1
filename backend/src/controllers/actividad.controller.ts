import { Request, Response, NextFunction } from 'express';
import { ActividadService } from '../services/actividad.service';
import { ApiCorrectResponse, InternalServerError, UnauthorizedError } from '../utils';
import { ExportActivitiesDto } from '../dtos/actividades';

const actividadService = new ActividadService();

export class ActividadController {
  public async crearActividad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const id_nino = Number(req.params.id_nino);
      const dto = req.body;
      const nueva = await actividadService.createActividad(id_nino, dto, user.id);
      ApiCorrectResponse.genericSuccess(res, nueva, true, 'Actividad creada', 201);
    } catch (err) {
      next(err);
    }
  }



  public async listarActividadesPorNino(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const lista = await actividadService.getAllActivitiesByNino(id_nino);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de actividades por Niño', 200);
    } catch (err) {
      next(err);
    }
  }

  public async listarActividadesPorFamilia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_familia = Number(req.params.id_familia);
      const lista = await actividadService.getAllActivitiesByFamily(id_familia);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de actividades por Familia', 200);
    } catch (err) {
      next(err);
    }
  }

  public async actualizarActividad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await actividadService.updateActividad(id_nino, id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Actividad actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  public async borrarActividad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await actividadService.deleteActividad(id_nino, id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Actividad borrada', 204);
    } catch (err) {
      next(err);
    }
  }


  public async exportarActividades(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      // Esta validación debería ser redundante porque el usuario solo debe acceder a actividades de niños asociados a su familiaç
      // Comentar en test para exportar pdfs 👇
      const isValidRequest = await actividadService.validateExportRequest(req.body.activityIds, user.id);
      if (!isValidRequest) {
        throw new UnauthorizedError('No tienes permiso para exportar estas actividades', {
          error: 'UNAUTHORIZED',
          detalle: 'No tienes permiso para exportar estas actividades',
        });
      }
      // Comentar 👆
      const dto: ExportActivitiesDto = req.body;
      const doc:PDFKit.PDFDocument | null = await actividadService.exportActivitiesToPdf(dto);
      if(!doc){
        throw new InternalServerError('Error interno al exportar actividades', {
          error: 'INTERNAL_SERVER_ERROR',
          detalle: 'Error al exportar actividades',
        });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=informe-actividades.pdf'); // 'attachment' para forzar descarga

      doc.pipe(res);
      doc.info.Title = 'Informe de Actividades';
      doc.info.Author = 'Nido';
      doc.info.Subject = 'Informe de Actividades';
      doc.info.CreationDate = new Date();
      doc.info.ModDate = new Date();
      doc.end();
     
    } catch (err) {
      next(err);
    }
  }


  public async getAllActivitiesFromArray(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activityIds: number[] = req.body.activityIds;
      const actividades = await actividadService.getAllActivitiesFromArray(activityIds);
      ApiCorrectResponse.genericSuccess(res, actividades, true, 'Actividades obtenidas', 200);
    } catch (err) {
      next(err);
    }
  }

  public async getMyActivities(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const actividades = await actividadService.getAllActivitiesByUser(user.id);
      ApiCorrectResponse.genericSuccess(res, actividades, true, 'Actividades obtenidas', 200);
    } catch (err) {
      next(err);
    }
  }


}
