import { Router } from "express";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { ActividadController } from "../controllers/actividad.controller";
import { asyncMiddlewareWrapper } from "../utils";
import { CreateActividadDto } from "../dtos/actividades/create-actividad.dto";
import { UpdateActividadDto } from "../dtos/actividades/update-actividad.dto";
import { ExportActivitiesDto } from "../dtos/actividades";

const controller = new ActividadController();
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/ninos/{id_nino}/actividades:
 *   post:
 *     summary: Crea una actividad
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
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
  "/ninos/:id_nino",
  asyncMiddlewareWrapper(authMiddleware),

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
 *     security:
 *       - bearerAuth: []
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
  "/ninos/:id_nino",
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(controller.listarActividadesPorNino.bind(controller))
);

/**
 * @openapi
 * /api/familias/{id_familia}/actividades:
 *   get:
 *     summary: Lista todas las actividades de la familia
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
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
  "/familias/:id_familia",
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(
    controller.listarActividadesPorFamilia.bind(controller)
  )
);

/**
 * @openapi
 * /api/ninos/{id_nino}/actividades/{id}:
 *   put:
 *     summary: Actualiza una actividad
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
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
  "/ninos/:id_nino/:id",
  asyncMiddlewareWrapper(authMiddleware),
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
 *     security:
 *       - bearerAuth: []
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
  "/ninos/:id_nino/:id",
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(controller.borrarActividad.bind(controller))
);

/**
 * @openapi
 * /api/actividades/export:
 *   post:
 *     summary: Genera un reporte de actividades en base a la selección del usuario
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/ExportActivitiesDto'
 *     responses:
 *       '200':
 *         description: Actividades exportadas exitosamente
 */
router.post(
  "/export",
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(ExportActivitiesDto),
  controller.exportarActividades
);


/**
 * @openapi
 * /api/actividades/all:
 *   get:
 *     summary: Obtiene todas las actividades de un niño
 *     tags:
 *       - Actividades
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de todas las actividades del niño
 */

router.get(
  "/all",
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(controller.getAllActivitiesFromArray.bind(controller))
);

export default router;
