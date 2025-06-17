import { Router } from "express";
import { RemindersController } from "../controllers";
import { asyncMiddlewareWrapper } from "../utils";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { NewReminderDto, UpdateReminderDto } from "../dtos";

const remindersRoute = Router();
const remindersControllers = new RemindersController();

/**
 * @openapi
 * /api/reminders:
 *   get:
 *     summary: Obtener todos los recordatorios de un usuario por su id
 *     tags:
 *       - Recordatorios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Recordatorios obtenidos con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         description: No autorizado
 */
remindersRoute.get("/", asyncMiddlewareWrapper(authMiddleware), remindersControllers.getAllRemindersByUser);

/**
 * @openapi
 * /api/reminders/new:
 *   post:
 *     summary: Crea un nuevo recordatorio
 *     tags:
 *       - Recordatorios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewReminderDto'
 *     responses:
 *       '201':
 *         description: Recordatorio creado exitosamente
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

remindersRoute.post("/new", asyncMiddlewareWrapper(authMiddleware),   validationMiddleware(NewReminderDto),
remindersControllers.createReminder);

/**
 * @openapi
 * /api/reminders/{id}:
 *   get:
 *     summary: Obtener un recordatorio en concreto por id
 *     tags:
 *       - Recordatorios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Recordatorios obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         description: No autorizado
 */
remindersRoute.get("/:id", asyncMiddlewareWrapper(authMiddleware), remindersControllers.getReminderById);

/**
 * @openapi
 * /api/reminders/update:
 *   patch:
 *     summary: Crea un nuevo recordatorio
 *     tags:
 *       - Recordatorios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateReminderDto'
 *     responses:
 *       '201':
 *         description: Recordatorio actualizado exitosamente
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
remindersRoute.patch("update", asyncMiddlewareWrapper(authMiddleware), validationMiddleware(UpdateReminderDto),
remindersControllers.updateReminder);

export default remindersRoute;