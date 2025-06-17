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
 *     summary: Crea una nueva invitación y la devuelve
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
 * /api/invitations/respond:
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


/**
 * @openapi
 * /api/invitations/sent:
 *   get:
 *     summary: Obtener las invitaciones enviadas por el usuario autenticado
 *     tags:
 *       - Invitaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Invitaciones enviadas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         description: No autorizado
 */
invitationsRoute.get(
  "/sent",
  asyncMiddlewareWrapper(authMiddleware),
  invitationsController.getSentInvitations
);

/**
 * @openapi
 * /api/invitations/received:
 *   get:
 *     summary: Obtener las invitaciones recibidas por el usuario autenticado
 *     tags:
 *       - Invitaciones
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Invitaciones recibidas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         description: No autorizado
 */
invitationsRoute.get(
  "/received",
  asyncMiddlewareWrapper(authMiddleware),
  invitationsController.getReceivedInvitations
);

/**
 * @openapi
 * /api/invitations/{id}:
 *   get:
 *     summary: Obtener una invitación por ID
 *     tags:
 *       - Invitaciones
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la invitación
 *     responses:
 *       '200':
 *         description: Invitación obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Invitación no encontrada
 */
invitationsRoute.get(
  "/:id",
  asyncMiddlewareWrapper(authMiddleware),
  invitationsController.getInvitationById
);


export default invitationsRoute;
