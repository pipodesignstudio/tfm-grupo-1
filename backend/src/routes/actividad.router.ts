import { Router } from 'express';
import { validationMiddleware } from '../middlewares';
import { ActividadController } from '../controllers/actividad.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { CreateActividadDto } from '../dtos/actividades/create-actividad.dto';
import { UpdateActividadDto } from "../dtos/actividades/update-actividad.dto";

const controller = new ActividadController();
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/ninos/{id_nino}/actividades:
 *   post:
 *     summary: Crea una actividad 
 *     tags:
 *       - Actividades
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
 *             $ref: '#/components/schemas/CreateActividadDto'
 *     responses:
 *       '201':
 *         description: Actividad creada exitosamente
 */
router.post(
  '/ninos/:id_nino',
  validationMiddleware(CreateActividadDto),
  asyncMiddlewareWrapper(controller.crearActividad.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/actividades:
 *   get:
 *     summary: Lista todas las actividades del niño
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de actividades
 */
router.get(
  '/ninos/:id_nino',
  asyncMiddlewareWrapper(controller.listarActividadesPorNino.bind(controller))
);

/**
 * @openapi
 * /api/familias/{id_familia}/actividades:
 *   get:
 *     summary: Lista todas las actividades de la familia
 *     tags:
 *       - Actividades
 *     parameters:
 *       - in: path
 *         name: id_familia
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de actividades de la familia
 */
router.get(
  '/familias/:id_familia',
  asyncMiddlewareWrapper(controller.listarActividadesPorFamilia.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/actividades/{id}:
 *   put:
 *     summary: Actualiza una actividad
 *     tags:
 *       - Actividades
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
 *             $ref: '#/components/schemas/UpdateActividadDto'
 *     responses:
 *       '200':
 *         description: Actividad actualizada exitosamente
 */
router.put(
  '/ninos/:id_nino/:id',
  validationMiddleware(UpdateActividadDto, true),
  asyncMiddlewareWrapper(controller.actualizarActividad.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/actividades/{id}:
 *   delete:
 *     summary: Elimina una actividad
 *     tags:
 *       - Actividades
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
 *         description: Actividad eliminada exitosamente
 */
router.delete(
  '/ninos/:id_nino/:id',
  asyncMiddlewareWrapper(controller.borrarActividad.bind(controller))
);

export default router;