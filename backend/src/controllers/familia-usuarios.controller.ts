import { Request, Response, NextFunction } from 'express';
import { FamiliaUsuariosService } from '../services/familia-usuarios.service';
import { ApiCorrectResponse } from '../utils';

const service = new FamiliaUsuariosService();

export class FamiliaUsuariosController {
  /**
   * Obtener los usuarios de una familia
   */
  public async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarios = await service.listarUsuariosDeFamilia(familiaId);
      ApiCorrectResponse.genericSuccess(res, usuarios, true, 'Usuarios obtenidos', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Añadir un usuario a la familia
   */
  public async agregar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const dto = req.body;
      const nuevo = await service.agregarUsuarioAFamilia(familiaId, dto);
      ApiCorrectResponse.genericSuccess(res, nuevo, true, 'Usuario añadido a la familia', 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualizar el rol de un usuario en la familia
   */
  public async actualizarRol(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarioId = Number(req.params.usuarioId);
      const dto = req.body;
      await service.actualizarRolUsuario(familiaId, usuarioId, dto);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Rol actualizado', 200);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Eliminar un usuario de la familia
   */
  public async eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarioId = Number(req.params.usuarioId);
      await service.eliminarUsuarioDeFamilia(familiaId, usuarioId);
      ApiCorrectResponse.genericSuccess(res, null, true, 'Usuario eliminado', 204);
    } catch (err) {
      next(err);
    }
  }
}
