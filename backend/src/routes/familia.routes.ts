import { Router } from "express";
import { FamiliaController } from "../controllers/familia.controller";
import { asyncMiddlewareWrapper } from '../utils';
import { authMiddleware, validationMiddleware, validateIdParam } from "../middlewares";
import { NewFamiliaDto, UpdateFamiliaDto } from "../dtos/familia";

const familiaRoutes = Router();
const familiaController = new FamiliaController();

/**
 * POST - Crear nueva familia
 */
/**
 * @openapi
 * /familia:
 *   post:
 *     summary: Crear una nueva familia
 *     tags:
 *       - Familia
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewFamiliaDto'
 *     responses:
 *       '201':
 *         description: Familia creada exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autorizado
 */
familiaRoutes.post(
  "/",
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(NewFamiliaDto),
  familiaController.create
);

/**
 * GET - Obtener todas las familia
 */
/**
 * @openapi
 * /familia:
 *   get:
 *     summary: Obtener todas las familias (uso interno o admin)
 *     tags:
 *       - Familia
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Familias obtenidas exitosamente
 *       '401':
 *         description: No autorizado
 */
familiaRoutes.get(
  "/", 
  asyncMiddlewareWrapper(authMiddleware),
  familiaController.getAll
);

/**
 * GET - Obtener familia por ID
 */
/**
 * @openapi
 * /familia/{id}:
 *   get:
 *     summary: Obtener una familia por ID
 *     tags:
 *       - Familia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Familia encontrada
 *       '404':
 *         description: Familia no encontrada
 *       '401':
 *         description: No autorizado
 */
familiaRoutes.get(
  "/:id", 
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam, 
  familiaController.getById
);

/**
 * PUT - Actualizar familia
 */
/**
 * @openapi
 * /familia/{id}:
 *   put:
 *     summary: Actualizar una familia existente
 *     tags:
 *       - Familia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFamiliaDto'
 *     responses:
 *       '200':
 *         description: Familia actualizada exitosamente
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Familia no encontrada
 *       '401':
 *         description: No autorizado
 */
familiaRoutes.put(
  "/:id",
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  validationMiddleware(UpdateFamiliaDto),
  familiaController.update
);

/**
 * DELETE - Eliminar familia
 */
/**
 * @openapi
 * /familia/{id}:
 *   delete:
 *     summary: Eliminar una familia
 *     tags:
 *       - Familia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Familia eliminada exitosamente
 *       '404':
 *         description: Familia no encontrada
 *       '401':
 *         description: No autorizado
 */
familiaRoutes.delete(
    "/:id", 
    asyncMiddlewareWrapper(authMiddleware), 
    validateIdParam, 
    familiaController.delete
);

export default familiaRoutes;
