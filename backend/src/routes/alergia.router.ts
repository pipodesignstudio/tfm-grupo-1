import { Router } from 'express';
import { validationMiddleware } from '../middlewares';
import { CreateAlergiaDto } from '../dtos/alergias/create-alergia.dto';
import { UpdateAlergiaDto } from '../dtos/alergias/update-alergia.dto';
import { AlergiaController } from '../controllers/alergia.controller';
import { asyncMiddlewareWrapper } from '../utils';

const controller = new AlergiaController();
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/ninos/{id_nino}/alergias:
 *   get:
 *     summary: Obtiene todas las alergias de un niño
 *     tags:
 *       - Alergias
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de alergias
 */
router.get(
  '/',
  asyncMiddlewareWrapper(controller.listar.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/alergias:
 *   post:
 *     summary: Crea una nueva alergia para un niño
 *     tags:
 *       - Alergias
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAlergiaDto'
 *     responses:
 *       '201':
 *         description: Alergia creada exitosamente
 */
router.post(
  '/',
  validationMiddleware(CreateAlergiaDto),
  asyncMiddlewareWrapper(controller.crear.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/alergias/{id}:
 *   put:
 *     summary: Actualiza una alergia existente
 *     tags:
 *       - Alergias
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAlergiaDto'
 *     responses:
 *       '200':
 *         description: Alergia actualizada exitosamente
 */
router.put(
  '/:id',
  validationMiddleware(UpdateAlergiaDto, true),
  asyncMiddlewareWrapper(controller.actualizar.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/alergias/{id}:
 *   delete:
 *     summary: Elimina una alergia
 *     tags:
 *       - Alergias
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Alergia eliminada exitosamente
 */
router.delete(
  '/:id',
  asyncMiddlewareWrapper(controller.borrar.bind(controller))
);

export default router;