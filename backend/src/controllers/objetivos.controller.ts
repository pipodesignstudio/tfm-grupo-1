import { Request, Response, NextFunction } from 'express';
import { ApiCorrectResponse } from '../utils/success-api-response.util';
import { ObjetivosService } from '../services/objetivos.service';
import { CreateObjetivoDto } from '../dtos/objetivos/create-objetivo.dto';
import { UpdateObjetivoDto } from '../dtos/objetivos/update-objetivo.dto';

export class ObjetivosController {
  private objetivosService = new ObjetivosService();

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.objetivosService.create(
        Number(req.params.id_nino),
        req.body as CreateObjetivoDto
      );
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 201);
    } catch (err) {
      next(err);
    }
  }

  public async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.objetivosService.findAllByNino(Number(req.params.id_nino));
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 200);
    } catch (err) {
      next(err);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.objetivosService.update(
        Number(req.params.id_nino),
        Number(req.params.id),
        req.body as UpdateObjetivoDto
      );
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 200);
    } catch (err) {
      next(err);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.objetivosService.delete(Number(req.params.id_nino), Number(req.params.id));
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 200);
    } catch (err) {
      next(err);
    }
  }
}
