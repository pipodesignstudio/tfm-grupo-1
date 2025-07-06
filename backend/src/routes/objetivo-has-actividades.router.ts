import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { authMiddleware, validationMiddleware, validateIdParam } from '../middlewares';
import { NewNoteDto, UpdateNoteDto } from '../dtos/notes';
import { ObjetivosHasActivitiesController } from '../controllers/objetivo-has-actividades.controller';

const objetivosHasActivitiesRoute = Router();
const objetivosHasActivitiesController = new ObjetivosHasActivitiesController();


/**
 * POST - Crear una nueva relación entre un objetivo y una actividad
 */
/**
 * @openapi
 * /api/objetivos/{objetivo_id}/actividades/{actividad_id}:
 *   post:
 *     summary: Crea una relación entre un objetivo y una actividad
 *     tags:
 *       - Objetivos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objetivo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del objetivo
 *       - in: path
 *         name: actividad_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     responses:
 *       '201':
 *         description: Relación creada exitosamente
 *       '400':
 *         description: Datos inválidos o relación ya existente
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error del servidor
 */

objetivosHasActivitiesRoute.post(
  '/:objetivo_id/actividades/:actividad_id',
    asyncMiddlewareWrapper(authMiddleware),

  asyncMiddlewareWrapper(objetivosHasActivitiesController.create.bind(objetivosHasActivitiesController))
);
/**
 * DELETE - Eliminar una relación entre un objetivo y una actividad
 */
/**
 * @openapi
 * /api/objetivos/{objetivo_id}/actividades/{actividad_id}:
 *   delete:
 *     summary: Elimina una relación entre un objetivo y una actividad
 *     tags:
 *       - Objetivos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: objetivo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del objetivo
 *       - in: path
 *         name: actividad_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la actividad
 *     responses:
 *       '204':
 *         description: Relación eliminada exitosamente
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Relación no encontrada
 *       '500':
 *         description: Error del servidor
 */

objetivosHasActivitiesRoute.delete(
  '/:objetivo_id/actividades/:actividad_id',
    asyncMiddlewareWrapper(authMiddleware),

  asyncMiddlewareWrapper(objetivosHasActivitiesController.delete.bind(objetivosHasActivitiesController))
);

export default objetivosHasActivitiesRoute;