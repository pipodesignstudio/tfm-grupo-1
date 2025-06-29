// routes/objetivos.router.ts
import { Router } from 'express';
import { asyncMiddlewareWrapper } from '../utils';
import { ObjetivosController } from '../controllers/objetivos.controller';
import { authMiddleware, validationMiddleware } from '../middlewares';
import { CreateObjetivoDto } from '../dtos/objetivos/create-objetivo.dto';
import { UpdateObjetivoDto } from '../dtos/objetivos/update-objetivo.dto';

const objController = new ObjetivosController();
const objetivosRouter = Router({ mergeParams: true });

/**
 * @openapi
 * /api/ninos/{id_nino}/objetivos:
 *   get:
 *     summary: Lista todos los objetivos de un niño
 *     tags: [Objetivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Objetivos obtenidos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 */
objetivosRouter.get(
  '/', 
  asyncMiddlewareWrapper(authMiddleware), 
  asyncMiddlewareWrapper(objController.list.bind(objController)));

/**
 * @openapi
 * /api/ninos/{id_nino}/objetivos:
 *   post:
 *     summary: Crea un nuevo objetivo para un niño
 *     tags: [Objetivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateObjetivoDto' }
 *           examples:
 *             ejemplo:
 *               value:
 *                 nombre: "Aprender a leer"
 *                 color: "#FFD700"
 *                 tipo: "Académico"
 *                 fecha_fin: "2025-12-31"
 *                 actividades_ids: [1, 2]
 *     responses:
 *       '201':
 *         description: Objetivo creado exitosamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '400':
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BadRequestError' }
 */
objetivosRouter.post(
  '/',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(CreateObjetivoDto),
  asyncMiddlewareWrapper(objController.create.bind(objController))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/objetivos/{id}:
 *   put:
 *     summary: Actualiza un objetivo
 *     tags: [Objetivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateObjetivoDto' }
 *           examples:
 *             ejemplo:
 *               value:
 *                 nombre: "Mejorar comprensión lectora"
 *                 color: "#00FF00"
 *                 tipo: "Académico"
 *                 actividades_ids: [3, 4]
 *     responses:
 *       '200':
 *         description: Objetivo actualizado correctamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '404':
 *         description: Objetivo o niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 */
objetivosRouter.put(
  '/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(UpdateObjetivoDto, true),
  asyncMiddlewareWrapper(objController.update.bind(objController))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/objetivos/{id}:
 *   delete:
 *     summary: Elimina un objetivo
 *     tags: [Objetivos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Objetivo eliminado correctamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '404':
 *         description: Objetivo no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 */
objetivosRouter.delete(
  '/:id',
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(objController.delete.bind(objController))
);

export default objetivosRouter;
