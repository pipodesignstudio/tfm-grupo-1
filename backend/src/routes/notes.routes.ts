import { Router } from 'express';
import { NotesController } from '../controllers/notes.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { authMiddleware, validationMiddleware, validateIdParam } from '../middlewares';
import { NewNoteDto, UpdateNoteDto } from '../dtos/notes';

const notesRoute = Router();
const notesController = new NotesController();

/**
 * POST - Crear nueva nota
 */
/**
 * @openapi
 * /api/notes/{id_nino}:
 *   post:
 *     summary: Crear una nueva nota para un niño
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_nino
 *         in: path
 *         required: true
 *         description: ID del niño
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewNoteDto'
 *     responses:
 *       '201':
 *         description: Nota creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autorizado
 */
notesRoute.post(
  '/:id_nino',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  validationMiddleware(NewNoteDto),
  notesController.create
);

/**
 * GET - Listar todas las notas de un niño
 */
/**
 * @openapi
 * /api/notes/{id_nino}:
 *   get:
 *     summary: Obtener todas las notas de un niño
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_nino
 *         in: path
 *         required: true
 *         description: ID del niño
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Notas obtenidas con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         description: No autorizado
 */
notesRoute.get(
  '/:id_nino',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  notesController.getAll
);

/**
 * GET - Obtener una nota específica
 */
/**
 * @openapi
 * /api/notes/{id_nino}/{id}:
 *   get:
 *     summary: Obtener una nota específica de un niño
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_nino
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la nota
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Nota obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Nota no encontrada
 *       '401':
 *         description: No autorizado
 */
notesRoute.get(
  '/:id_nino/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  notesController.getById
);

/**
 * PUT - Actualizar una nota
 */
/**
 * @openapi
 * /api/notes/{id_nino}/{id}:
 *   put:
 *     summary: Actualizar una nota específica de un niño
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_nino
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la nota
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteDto'
 *     responses:
 *       '200':
 *         description: Nota actualizada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Nota no encontrada
 *       '400':
 *         description: Datos inválidos
 *       '401':
 *         description: No autorizado
 */

notesRoute.put(
  '/:id_nino/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  validationMiddleware(UpdateNoteDto),
  notesController.update
);

/**
 * DELETE - Eliminar una nota
 */
/**
 * @openapi
 * /api/notes/{id_nino}/{id}:
 *   delete:
 *     summary: Eliminar una nota específica de un niño
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id_nino
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la nota
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Nota eliminada exitosamente
 *       '404':
 *         description: Nota no encontrada
 *       '401':
 *         description: No autorizado
 */
notesRoute.delete(
  '/:id_nino/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  notesController.delete
);

export default notesRoute;
