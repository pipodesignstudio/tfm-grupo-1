import { Router } from "express";
import { asyncMiddlewareWrapper } from "../utils";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { validateIdParam } from "../middlewares/validate-id.middleware";
import { NewNoteDto, UpdateNoteDto } from "../dtos/notes";
import { NotesController } from "../controllers/notes.controller";


const notesRoute = Router();
const notesController = new NotesController();

/**
 * @openapi
 * /api/notes:
 *   get:
 *     summary: Obtener todas las notas de los niños asociados al usuario
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
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
// GET todas las notas del usuario (asociado a sus niños)
notesRoute.get(
  '/',
  asyncMiddlewareWrapper(authMiddleware),
  notesController.getAllNotas
);

/**
 * @openapi
 * /api/notes/{id}:
 *   get:
 *     summary: Obtener una nota por su ID
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la nota a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Nota obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Nota no encontrada
 */
// GET nota por ID
notesRoute.get(
  '/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  notesController.getNotaById
);

/**
 * @openapi
 * /api/notes:
 *   post:
 *     summary: Crear una nueva nota
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
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
 */
// POST crear nota
notesRoute.post(
  '/',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(NewNoteDto),
  notesController.createNota
);

/**
 * @openapi
 * /api/notes/{id}:
 *   put:
 *     summary: Actualizar una nota existente
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la nota a actualizar
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
 *         description: Nota actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Datos inválidos
 *       '404':
 *         description: Nota no encontrada
 */
// PUT actualizar nota
notesRoute.put(
  '/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  validationMiddleware(UpdateNoteDto),
  notesController.updateNota
);

/**
 * @openapi
 * /api/notes/{id}:
 *   delete:
 *     summary: Eliminar una nota por su ID
 *     tags:
 *       - Notas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la nota a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Nota eliminada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: Nota no encontrada
 */
// DELETE nota
notesRoute.delete(
  '/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  notesController.deleteNota
);

export default notesRoute;
