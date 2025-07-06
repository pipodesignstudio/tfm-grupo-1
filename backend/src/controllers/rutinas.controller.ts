import { Request, Response, NextFunction } from "express";
import { RutinasService } from "../services/rutinas.service";
import { CreateRutinaDto } from "../dtos/rutinas/create-rutina.dto";
import { UpdateRutinaDto } from "../dtos/rutinas/update-rutina.dto";
import { ApiCorrectResponse } from "../utils/success-api-response.util";

export class RutinasController {
  private rutinasService = new RutinasService();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.rutinasService.create(
        Number(req.params.id_nino),
        req.body as CreateRutinaDto
      );
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 201);
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.rutinasService.findAllByNino(
        Number(req.params.id_nino)
      );
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 200);
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.rutinasService.update(
        Number(req.params.id_nino),
        Number(req.params.id),
        req.body as UpdateRutinaDto
      );
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 200);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.rutinasService.delete(
        Number(req.params.id_nino),
        Number(req.params.id)
      );
      ApiCorrectResponse.genericSuccess(res, result, true, result.message, 200);
    } catch (err) {
      next(err);
    }
  }
}
