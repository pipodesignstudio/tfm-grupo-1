import { Router } from "express";
import { asyncMiddlewareWrapper } from "../utils";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { InvitationResponseDto, NewInvitationDto } from "../dtos";
import { InvitationsController } from "../controllers";

const invitationsRoute = Router();
const invitationsController = new InvitationsController();

/**
 * @openapi
 * /api/invitations/send:
 *   post:
 *     summary: Crea una nueva invitación
 *     tags:
 *       - Invitaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewInvitationDto'
 *     responses:
 *       '201':
 *         description: Invitación creada exitosamente
 *         content:
 *           application/json:             
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 */

invitationsRoute.post(
  "/send",
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(NewInvitationDto),
  invitationsController.createNewInvitation
);
/**
 * @openapi
 * /api/invitations/response:
 *   post:
 *     summary: Postea una respuesta por parte del usuario
 *     tags:
 *       - Invitaciones
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvitationResponseDto'
 *     responses:
 *       '201':
 *         description: Invitación creada exitosamente
 *         content:
 *           application/json:             
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 */

invitationsRoute.post(
  "/respond",
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(InvitationResponseDto),
  invitationsController.manageInvitationResponse
);

export default invitationsRoute;
