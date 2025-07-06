import { Request, Response, NextFunction } from "express";
import { NinosService } from "../services/ninos.service";
import { ApiCorrectResponse } from "../utils/success-api-response.util";

const ninosService = new NinosService();

export class NinosController {
  public async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const nuevo = await ninosService.create(req.body);
      ApiCorrectResponse.genericSuccess(res, nuevo, true, "Niño creado", 201);
    } catch (err) {
      next(err);
    }
  }

  public async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const nino = await ninosService.getById(Number(req.params.id));
      ApiCorrectResponse.genericSuccess(res, nino, true, "Niño obtenido", 200);
    } catch (err) {
      console.error('Error al obtener perfil de aprendizaje:', err);
      next(err);
    }
  }

  public async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log('Datos recibidos para actualizar:', req.body);
      await ninosService.update(Number(req.params.id), req.body);
      ApiCorrectResponse.genericSuccess(
        res,
        null,
        true,
        "Niño actualizado",
        200
      );
    } catch (err) {
      console.error('Error al actualizar perfil de aprendizaje:', err);
      next(err);
    }
  }

  public async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await ninosService.delete(Number(req.params.id));
      ApiCorrectResponse.genericSuccess(
        res,
        result,
        true,
        "Niño eliminado",
        200
      );
    } catch (err) {
      next(err);
    }
  }

  public async deleteByFamilia(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const familiaId = Number(req.params.familiaId);
      await ninosService.deleteByFamilia(familiaId);
      res
        .status(200)
        .json({
          message: "Todos los niños de la familia han sido eliminados.",
        });
    } catch (err) {
      next(err);
    }
  }

  public async listByFamilia(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const lista = await ninosService.listByFamilia(
        Number(req.params.familiaId)
      );
      ApiCorrectResponse.genericSuccess(
        res,
        lista,
        true,
        "Listado de niños",
        200
      );
    } catch (err) {
      next(err);
    }
  }
}
