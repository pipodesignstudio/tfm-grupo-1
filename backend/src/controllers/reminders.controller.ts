import { NextFunction, Request, Response } from "express";

import { RemindersService } from "../services";
import { NewReminderDto, UpdateReminderDto } from "../dtos";
import { ApiCorrectResponse } from "../utils";

const remindersService = new RemindersService();

export class RemindersController {
  /**
   * Crea un nuevo recordatorio.
   *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
   */
  async createReminder(req: Request, res: Response, next: NextFunction) {
    const reqUser = req.user!;
    const userId = reqUser.id;
    const dto: NewReminderDto = req.body as NewReminderDto;

    try {
      const reminder = await remindersService.createInvitation(dto, userId);
      return ApiCorrectResponse.genericSuccess(
        res,
        { reminder },
        true,
        "Recordatorio creado con éxito",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza un recordatorio existente.
   *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
   */
  async updateReminder(req: Request, res: Response, next: NextFunction) {
    const reqUser = req.user!;
    const userId = reqUser.id;
    const dto: UpdateReminderDto = req.body as UpdateReminderDto;

    try {
      const reminder = await remindersService.updateReminder(dto, userId);
      return ApiCorrectResponse.genericSuccess(
        res,
        { reminder },
        true,
        "Recordatorio actualizado con éxito",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene todos los recordatorios del usuario autenticado.
   *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
   */
  async getAllRemindersByUser(req: Request, res: Response, next: NextFunction) {
    const reqUser = req.user!;
    const userId = reqUser.id;

    try {
      const reminders = await remindersService.getAllRemindersByUser(userId);
      return ApiCorrectResponse.genericSuccess(
        res,
        { reminders },
        true,
        "Recordatorios obtenidos con éxito",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
 * Obtiene un recordatorio por su ID.
 *
 * @param req - La petición HTTP.
 * @param res - La respuesta HTTP.
 * @param next - El siguiente middleware a ejecutar.
 */
async getReminderById(req: Request, res: Response, next: NextFunction) {
  const id = +req.params.id;
  const reqUser = req.user!;
  const userId = reqUser.id;

  try {
    const reminder = await remindersService.getReminderById(id, userId);
    return ApiCorrectResponse.genericSuccess(
      res,
      { reminder },
      true,
      "Recordatorio obtenido con éxito",
      200
    );
  } catch (error) {
    next(error);
  }
}


}
