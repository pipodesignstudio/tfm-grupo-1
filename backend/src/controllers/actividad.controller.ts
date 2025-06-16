import { Request, Response, NextFunction } from 'express';
import { ActividadService } from '../services/actividad.service';
import { ApiCorrectResponse } from '../utils';

const actividadService = new ActividadService();

export class ActividadController {
  public async crearActividad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const dto = req.body;
      const nueva = await actividadService.createActividad(id_nino, dto);
      ApiCorrectResponse.genericSuccess(res, nueva, true, 'Actividad creada', 201);
    } catch (err) {
      next(err);
    }
  }



  public async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const lista = await actividadService.findAllByNino(id_nino);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de actividades', 200);
    } catch (err) {
      next(err);
    }
  }

  public async actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await actividadService.update(id_nino, id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Actividad actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  public async borrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await actividadService.delete(id_nino, id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Actividad borrada', 204);
    } catch (err) {
      next(err);
    }
  }
}
