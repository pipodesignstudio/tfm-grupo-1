import { Router } from 'express';
import { RutinasController } from '../controllers/rutinas.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { validationMiddleware } from '../middlewares';
import { CreateRutinaDto } from '../dtos/rutinas/create-rutina.dto';
import { UpdateRutinaDto } from '../dtos/rutinas/update-rutina.dto';

const rutinasRouter = Router({ mergeParams: true });
const rutinasController = new RutinasController();

/**
 * @openapi
 * /api/ninos/{id_nino}/rutinas:
 *   get:
 *     summary: Lista todas las rutinas de un niño
 *     tags: [Rutinas]
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Rutinas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '404':
 *         description: Niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 */
rutinasRouter.get('/', asyncMiddlewareWrapper(rutinasController.list.bind(rutinasController)));

/**
 * @openapi
 * /api/ninos/{id_nino}/rutinas:
 *   post:
 *     summary: Crea una nueva rutina para un niño
 *     tags: [Rutinas]
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CreateRutinaDto' }
 *           examples:
 *             ejemplo:
 *               value:
 *                 nombre: "Rutina de mañana"
 *                 descripcion: "Despertar, aseo y desayuno"
 *                 frecuencia: { lunes: true, martes: true }
 *                 fecha_fin: "2025-12-31"
 *                 actividades_ids: [10, 11]
 *     responses:
 *       '201':
 *         description: Rutina creada con éxito
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '400':
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BadRequestError' }
 */
rutinasRouter.post('/', validationMiddleware(CreateRutinaDto), asyncMiddlewareWrapper(rutinasController.create.bind(rutinasController)));

/**
 * @openapi
 * /api/ninos/{id_nino}/rutinas/{id}:
 *   put:
 *     summary: Actualiza una rutina existente
 *     tags: [Rutinas]
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
 *           schema: { $ref: '#/components/schemas/UpdateRutinaDto' }
 *           examples:
 *             ejemplo:
 *               value:
 *                 nombre: "Rutina de tarde"
 *                 actividades_ids: [12, 13]
 *     responses:
 *       '200':
 *         description: Rutina actualizada con éxito
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '404':
 *         description: Rutina o niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 */
rutinasRouter.put('/:id', validationMiddleware(UpdateRutinaDto, true), asyncMiddlewareWrapper(rutinasController.update.bind(rutinasController)));

/**
 * @openapi
 * /api/ninos/{id_nino}/rutinas/{id}:
 *   delete:
 *     summary: Elimina una rutina
 *     tags: [Rutinas]
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
 *         description: Rutina eliminada con éxito
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '404':
 *         description: Rutina no encontrada
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 */
rutinasRouter.delete('/:id', asyncMiddlewareWrapper(rutinasController.delete.bind(rutinasController)));

export default rutinasRouter;