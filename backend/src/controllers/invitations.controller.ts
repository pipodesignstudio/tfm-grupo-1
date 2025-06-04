import { NextFunction, Request, Response } from "express";
import { InvitationResponseDto, NewInvitationDto } from "../dtos";
import { InvitationsService } from "../services";
import {
  ApiCorrectResponse,
  BadRequestError,
  InternalServerError,
} from "../utils";

const invitationsService = new InvitationsService();

export class InvitationsController {
  /**
   * Crea una nueva invitación y la envía al destinatario por correo electrónico.
   *
   * @summary Crea una invitación y la envía por correo electrónico.
   * @description
   * Si la invitación ya existe y no ha sido atendida ni rechazada, se devuelve
   * la respuesta de la función `manageExistingInvitations` con los datos actualizados.
   * Si no existe, se crea y se envía al destinatario.
   *
   * @param {Request} req - Petición HTTP.
   * @param {Response} res - Respuesta HTTP.
   * @returns {Promise<void>}
   */
  public async createNewInvitation(req: Request, res: Response): Promise<void> {
    const user = req.user!;
    const { id } = user;
    const dto: NewInvitationDto = req.body;

    const familyExists =
      await invitationsService.ensureFamilyExistsAndBelongToUser(
        dto.familyId,
        id
      );
    if (!familyExists) {
      throw new BadRequestError(
        "No se ha encontrado la familia asignada a este usuario.",
        {
          error: "FAMILY_NOT_FOUND",
        }
      );
    }

    const pendingExists =
      await invitationsService.isPendingInvitationAlreadySent(
        dto.familyId,
        id,
        dto.destinationEmail
      );
    if (pendingExists) {
      const response = await invitationsService.manageExistingInvitations(
        dto.familyId,
        id,
        dto.destinationEmail,
        dto.role
      );
      if (!response.errors?.length) {
        return ApiCorrectResponse.genericSuccess(
          res,
          response,
          true,
          "Invitación actualizada con éxito",
          201
        );
      }
    }

    const isManaged = await invitationsService.manageCreateInvitation(dto, id);
    if (isManaged) {
      return ApiCorrectResponse.genericSuccess(
        res,
        {},
        true,
        "Invitación creada con éxito",
        201
      );
    }

    throw new InternalServerError(
      "Error interno al procesar la solicitud del usuario.",
      {
        error: "INTERNAL_SERVER_ERROR",
      }
    );
  }

  public async manageInvitationResponse(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = req.user!;
      const dto: InvitationResponseDto = req.body;

      const success = await invitationsService.manageInvitationResp(
        dto,
        user.id
      );

      if (!success) {
        throw new InternalServerError("Error al procesar la invitación.");
      }

      return ApiCorrectResponse.genericSuccess(
        res,
        {},
        true,
        "Invitación respondida con éxito",
        200
      );
    } catch (error) {
          return next(error);
    }
  }
}
