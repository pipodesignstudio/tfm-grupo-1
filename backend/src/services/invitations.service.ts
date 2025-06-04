import dotenv from "dotenv";

import prisma from "../config/prisma.config";
import { InvitationResponseDto, NewInvitationDto } from "../dtos";
import { IInvitation, IExistingInvitationResponse } from "../interfaces";
import { BadRequestError, InternalServerError, logger } from "../utils";
import { UserService } from "./user.service";
import { EmailService } from "./email.service";

dotenv.config();

export class InvitationsService {
  private userService: UserService = new UserService();
  private emailService: EmailService = new EmailService();
  private baseUrl = process.env.FRONTEND_URL;

  /**
   * Crea una nueva invitación y la envía al destinatario por correo electrónico.
   *
   * @param dto - Datos de la invitación (sin ID ni fecha).
   * @param requesterId - ID del usuario que envía la invitación.
   * @returns Booleano indicando si se ha podido crear y enviar la invitación.
   */
  async manageCreateInvitation(
    dto: NewInvitationDto,
    requesterId: number
  ): Promise<boolean> {
    try {
      const { destinationEmail, familyId, role } = dto;

      const invitation: Omit<IInvitation, "id" | "sentDate"> = {
        destinationEmail,
        familyId,
        senderId: requesterId,
        role,
        accepted: false,
        attended: false,
      };

      const invitationId = await this.saveInvitationIntoDB(invitation);
      if (!invitationId) return false;

      const sender = await this.userService.getUserById(requesterId);
      if (!sender) return false;

      const userExists = await this.userService.getUserByEmail(
        destinationEmail
      );

      // TODO: Llamar al servicio de familia para coger el nombre
      const url = userExists
        ? `${this.baseUrl}/dashboard/invitations/${invitationId}`
        : `${this.baseUrl}/auth/register?invitationId=${invitationId}`;

      const success = await this.emailService.sendInvitationEmailToUser(
        destinationEmail,
        sender.nick,
        url,
        "FAMILIA PROVISIONAL",
        !!userExists
      );

      return success;
    } catch (error) {
      logger.logError("Error al guardar la invitación en la base de datos");
      console.error(error);
      return false;
    }
  }

  /**
   * Garantizamos que no exista ya una invitación pendiente
   *
   * @param familyId - ID de la familia asociada a la invitación.
   * @param userId - ID del usuario que envía la invitación.
   * @param destinationEmail - Email del destinatario.
   * @returns Booleano indicando si ya existe una invitación pendiente.
   */
  async isPendingInvitationAlreadySent(
    familyId: number,
    userId: number,
    destinationEmail: string
  ): Promise<boolean> {
    const invitation = await prisma.invitacion_usuario_familia.findFirst({
      where: {
        familia_id: familyId,
        usuario_emisor: userId,
        email_destinatario: destinationEmail,
        atentido: false,
        aceptado: false,
      },
    });
    return !!invitation;
  }

  /**
   * Maneja actualizaciones en invitaciones existentes
   *
   * - Si existe una invitación pendiente y el rol cambia, la actualiza
   * - En caso contrario, retorna error
   */
  async manageExistingInvitations(
    familyId: number,
    userId: number,
    destinationEmail: string,
    role: "cuidador" | "admin" | "nino"
  ): Promise<IExistingInvitationResponse> {
    const invitation = await prisma.invitacion_usuario_familia.findFirst({
      where: {
        familia_id: familyId,
        usuario_emisor: userId,
        email_destinatario: destinationEmail,
        atentido: false,
        aceptado: false,
      },
      select: {
        id: true,
        rol: true,
      },
    });

    if (!invitation?.id) {
      return {
        result: "KO",
        errors: ["No existe la invitación en nuestro sistema"],
        responseMsg: "Error al actualizar la invitación.",
      };
    }

    // Caso 1: El usuario está actualizando el rol y no se había atendido
    if (invitation.rol !== role) {
      await prisma.invitacion_usuario_familia.update({
        where: { id: invitation.id },
        data: { rol: role },
      });
      return {
        result: "OK",
        errors: [],
        responseMsg: "La invitación ha sido actualizada con el rol solicitado.",
      };
    }

    return {
      result: "KO",
      errors: ["No hay acciones que puedan realizarse sobre esta invitación"],
      responseMsg: "Error al actualizar la invitación.",
    };
  }

  /**
   * Verifica si un usuario pertenece a una familia y pertenece al usuario.
   *
   * @param familyId - ID de la familia a comprobar.
   * @param userId - ID del usuario a comprobar.
   * @returns True si el usuario pertenece a la familia, false en caso contrario.
   */
  async ensureFamilyExistsAndBelongToUser(
    familyId: number,
    userId: number
  ): Promise<boolean> {
    try {
      const relation = await prisma.familia_usuarios.findUnique({
        where: {
          familia_id_usuarios_id: {
            familia_id: familyId,
            usuarios_id: userId,
          },
        },
      });
      return !!relation;
    } catch (error) {
      throw new InternalServerError(
        "Error interno al procesar la solicitud del usuario.",
        { error: "INTERNAL_SERVER_ERROR" }
      );
    }
  }

  /**
   * Guarda una invitación en la base de datos.
   *
   * @param invitation - Los datos de la invitación (sin ID ni fecha).
   * @returns El ID generado de la invitación o null en caso de error.
   */
  private async saveInvitationIntoDB(
    invitation: Omit<IInvitation, "id" | "sentDate">
  ): Promise<number | null> {
    try {
      const result = await prisma.invitacion_usuario_familia.create({
        data: {
          familia_id: invitation.familyId,
          usuario_emisor: invitation.senderId,
          email_destinatario: invitation.destinationEmail,
          rol: invitation.role,
          atentido: false,
          aceptado: false,
        },
      });
      return result.id;
    } catch (error) {
      logger.logError("Error al guardar la invitación en la base de datos");
      return null;
    }
  }

  // -------------------- Manage Invitations --------------------

  async manageInvitationResp(
  dto: InvitationResponseDto,
  userId: number
): Promise<boolean> {
  const { invitationId, isAccepted } = dto;

  const invitation = await prisma.invitacion_usuario_familia.findUnique({
    where: { id: invitationId },
    select: {
      familia_id: true,
      usuario_emisor: true,
      email_destinatario: true,
      rol: true,
      atentido: true,
      aceptado: true,
    },
  });

  if (!invitation) {
    const err = new BadRequestError(
      "No se ha encontrado la invitación.",
      { error: "INVITATION_NOT_FOUND" },
      false
    );
    logger.logError(err);
    throw err;
  }

  if (invitation.atentido) {
    const err = new BadRequestError(
      "La invitación ya ha sido atendida.",
      { error: "INVITATION_ALREADY_ATTENDED" },
      false
    );
    logger.logError(err);
    throw err;
  }

  try {
    await prisma.invitacion_usuario_familia.update({
      where: { id: invitationId },
      data: {
        atentido: true,
        aceptado: isAccepted,
      },
    });

    if (isAccepted) {
      await prisma.familia_usuarios.create({
        data: {
          familia_id: invitation.familia_id,
          usuarios_id: userId,
          rol: invitation.rol,
        },
      });
    }

    return true; 
  } catch (error) {
    logger.logError("Error al procesar la invitación");
    return false; 
  }
}
}
