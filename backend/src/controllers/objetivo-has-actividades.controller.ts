import { ObjetivosHasActivities } from '../services/objetivo-has-actividades.service';
import { Request, Response, NextFunction } from 'express';
import { NotesService } from '../services/notes.service';
import { ApiCorrectResponse } from '../utils';

const objetivosHasActivitiesService = new ObjetivosHasActivities();

export class ObjetivosHasActivitiesController {
  /**
   * Crear una nueva relación entre un objetivo y una actividad
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const objetivo_id = Number(req.params.objetivo_id);
      const actividad_id = Number(req.params.actividad_id);
      const nuevaRelacion = await objetivosHasActivitiesService.create(objetivo_id, actividad_id);
      ApiCorrectResponse.genericSuccess(res, nuevaRelacion, true, 'Relación creada', 201);
    } catch (err) {
      next(err);
    }
  }

    /**
     * Eliminar una relación entre un objetivo y una actividad
     */
    public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const objetivo_id = Number(req.params.objetivo_id);
        const actividad_id = Number(req.params.actividad_id);
        await objetivosHasActivitiesService.delete(objetivo_id, actividad_id);
        ApiCorrectResponse.genericSuccess(res, null, true, 'Relación eliminada', 200);
      } catch (err) {
        next(err);
      }
    }
}
  