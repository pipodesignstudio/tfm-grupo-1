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
   * Si ya existe una invitación pendiente, la actualiza en caso de que el
   * rol sea diferente.
   *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
   * @returns void
   */
  public async createNewInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
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
          { error: "FAMILY_NOT_FOUND" }
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

      const createdInvitation = await invitationsService.manageCreateInvitation(
        dto,
        id
      );

      if (createdInvitation) {
        return ApiCorrectResponse.genericSuccess(
          res,
          { invitation: createdInvitation },
          true,
          "Invitación creada con éxito",
          201
        );
      }

      // Error controlado si no se pudo crear
      throw new InternalServerError(
        "Error interno al procesar la solicitud del usuario.",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    } catch (error) {
      next(error); // Pasa cualquier error controlado o inesperado al middleware
    }
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


/**
 * Obtiene las invitaciones enviadas por un usuario.
 *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
 */

  async getSentInvitations(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const invitations = await invitationsService.getInvitationsFromUser(
        user.id,
        "sent"
      );
      return ApiCorrectResponse.genericSuccess(
        res,
        { invitations },
        true,
        "Invitaciones enviadas obtenidas con éxito",
        200
      );
    } catch (error) {
      next(error);
    }
  }


  /**
   * Obtiene las invitaciones recibidas por un usuario.
   *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
   */
  async getReceivedInvitations(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const invitations = await invitationsService.getInvitationsFromUser(
        user.id,
        "received"
      );
      return ApiCorrectResponse.genericSuccess(
        res,
        { invitations },
        true,
        "Invitaciones recibidas obtenidas con éxito",
        200
      );
    } catch (error) {
      next(error);
    }
  }


  /**
   * Obtiene una invitación por su ID.
   *
   * @param req - La petición HTTP.
   * @param res - La respuesta HTTP.
   * @param next - El siguiente middleware a ejecutar.
   */
  async getInvitationById(req: Request, res: Response, next: NextFunction) {
    const id = +req.params.id;

    try {
      const invitation = await invitationsService.getInvitationById(id);
      return ApiCorrectResponse.genericSuccess(
        res,
        { invitation },
        true,
        "Invitación obtenida con éxito",
        200
      );
    } catch (error) {
      next(error);
    }
  }

}
