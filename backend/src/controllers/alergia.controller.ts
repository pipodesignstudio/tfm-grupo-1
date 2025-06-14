import { Request, Response, NextFunction } from 'express';
import { AlergiaService } from '../services/alergia.service';
import { ApiCorrectResponse } from '../utils';

const alergiaService = new AlergiaService();

export class AlergiaController {
  public async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const dto = req.body;
      const nueva = await alergiaService.create(id_nino, dto);
      ApiCorrectResponse.genericSuccess(res, nueva, true, 'Alergia creada', 201);
    } catch (err) {
      next(err);
    }
  }

  public async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const lista = await alergiaService.findAllByNino(id_nino);
      ApiCorrectResponse.genericSuccess(res, lista, true, 'Listado de alergias', 200);
    } catch (err) {
      next(err);
    }
  }

  public async actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await alergiaService.update(id_nino, id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Alergia actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  public async borrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await alergiaService.delete(id_nino, id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Alergia borrada', 204);
    } catch (err) {
      next(err);
    }
  }
  
}