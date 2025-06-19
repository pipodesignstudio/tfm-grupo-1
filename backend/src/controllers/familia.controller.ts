import { Request, Response, NextFunction } from 'express';
import { FamiliaService } from '../services/familia.service';
import { ApiCorrectResponse } from '../utils';

const familiaService = new FamiliaService();

export class FamiliaController {
  /**
   * Crear una nueva familia
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const dto = req.body;
      const nuevaFamilia = await familiaService.crearFamilia(dto, userId);
      ApiCorrectResponse.genericSuccess(res, nuevaFamilia, true, 'Familia creada', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Listar todas las familias (uso interno o admin)
   */
  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familias = await familiaService.listarFamilias();
      ApiCorrectResponse.genericSuccess(res, familias, true, 'Listado de familias', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtener una familia por ID
   */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const familia = await familiaService.obtenerFamilia(id);
      ApiCorrectResponse.genericSuccess(res, familia, true, 'Familia obtenida', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualizar una familia
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await familiaService.actualizarFamilia(id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Familia actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Borrar una familia
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await familiaService.borrarFamilia(id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Familia eliminada', 204);
    } catch (err) {
      next(err);
    }
  }
}
