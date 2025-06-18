import { Request, Response, NextFunction } from 'express';
import { NotesService } from '../services/notes.service';
import { ApiCorrectResponse } from '../utils';

const notesService = new NotesService();

export class NotesController {
  /**
   * Crear una nueva nota para un niño
   */
  public async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const dto = req.body;
      const nuevaNota = await notesService.create(id_nino, dto);
      ApiCorrectResponse.genericSuccess(res, nuevaNota, true, 'Nota creada', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Listar todas las notas de un niño
   */
  public async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const notas = await notesService.findAllByNino(id_nino);
      ApiCorrectResponse.genericSuccess(res, notas, true, 'Listado de notas', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtener una nota por ID (si pertenece al niño)
   */
  public async obtener(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      const nota = await notesService.findById(id_nino, id);
      ApiCorrectResponse.genericSuccess(res, nota, true, 'Nota obtenida', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualizar una nota por ID
   */
  public async actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await notesService.update(id_nino, id, req.body);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Nota actualizada', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Borrar una nota por ID
   */
  public async borrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id_nino = Number(req.params.id_nino);
      const id = Number(req.params.id);
      await notesService.delete(id_nino, id);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Nota borrada', 204);
    } catch (err) {
      next(err);
    }
  }
}
