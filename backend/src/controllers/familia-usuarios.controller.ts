import { Request, Response, NextFunction } from "express";
import { FamiliaUsuariosService } from "../services/familia-usuarios.service";
import { ApiCorrectResponse } from "../utils";

const service = new FamiliaUsuariosService();

export class FamiliaUsuariosController {
  /**
   * Obtener los usuarios de una familia
   */
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarios = await service.getAll(familiaId);
      ApiCorrectResponse.genericSuccess(
        res,
        usuarios,
        true,
        "Usuarios obtenidos",
        200
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Añadir un usuario a la familia
   */
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const dto = req.body;
      const nuevo = await service.create(familiaId, dto);
      ApiCorrectResponse.genericSuccess(
        res,
        nuevo,
        true,
        "Usuario añadido a la familia",
        201
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Actualizar el rol de un usuario en la familia
   */
  public async changeRol(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarioId = Number(req.params.usuarioId);
      const dto = req.body;
      await service.update(familiaId, usuarioId, dto);
      ApiCorrectResponse.genericSuccess(
        res,
        null,
        true,
        "Rol actualizado",
        200
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Eliminar un usuario de la familia
   */
  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarioId = Number(req.params.usuarioId);
      await service.delete(familiaId, usuarioId);
      ApiCorrectResponse.genericSuccess(
        res,
        null,
        true,
        "Usuario eliminado",
        204
      );
    } catch (err) {
      next(err);
    }
  }

  /**
   * Salir de la familia
   */
  public async salir(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const familiaId = Number(req.params.id);
      const usuarioId = Number(req.user!.id); 

      if (!familiaId || !usuarioId) {
        throw new Error("Familia ID y Usuario ID son requeridos");
      }


      await service.delete(familiaId, usuarioId);
      ApiCorrectResponse.genericSuccess(
        res,
        null,
        true,
        "Usuario eliminado de la familia",
        204
      );
    } catch (err) {
      next(err);
    }
  }
}
