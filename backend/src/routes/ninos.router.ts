import { Router } from 'express';
import { validationMiddleware } from '../middlewares';
import { CreateNinoDto } from '../dtos/ninos/create-nino.dto';
import { UpdateNinoDto } from '../dtos/ninos/update-nino.dto';
import { NinosController } from '../controllers/ninos.controller';
import { asyncMiddlewareWrapper } from '../utils';

const controller = new NinosController();
const router = Router();

/**
 * @openapi
 * /api/ninos:
 *   post:
 *     summary: Crea un nuevo niño
 *     tags: [Niños]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNinoDto'
 *           examples:
 *             ejemplo:
 *               value:
 *                 perfiles_aprendizaje_id: 2
 *                 familia_id: 3
 *                 nombre: "Lucas"
 *                 apellido: "García"
 *                 fecha_nacimiento: "2015-06-17"
 *                 genero: "masculino"
 *                 peso: 28
 *                 altura: 120
 *     responses:
 *       '201':
 *         description: Niño creado con éxito
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NinoSuccessResponse' }
 *       '400':
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BadRequestError' }
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedError' }
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InternalServerError' }
 */
router.post(
  '/',
  validationMiddleware(CreateNinoDto),
  asyncMiddlewareWrapper(controller.create.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id}:
 *   get:
 *     summary: Obtiene un niño por ID
 *     tags: [Niños]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Niño encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NinoSuccessResponse' }
 *       '404':
 *         description: Niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedError' }
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InternalServerError' }
 */
router.get(
  '/:id',
  asyncMiddlewareWrapper(controller.getById.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id}:
 *   put:
 *     summary: Actualiza un niño
 *     tags: [Niños]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/UpdateNinoDto' }
 *     responses:
 *       '200':
 *         description: Niño actualizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '400':
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/BadRequestError' }
 *       '404':
 *         description: Niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedError' }
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InternalServerError' }
 */
router.put(
  '/:id',
  validationMiddleware(UpdateNinoDto, true),
  asyncMiddlewareWrapper(controller.update.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id}:
 *   delete:
 *     summary: Elimina un niño
 *     tags: [Niños]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Niño eliminado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SuccessResponse' }
 *       '404':
 *         description: Niño no encontrado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedError' }
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InternalServerError' }
 */
router.delete(
  '/:id',
  asyncMiddlewareWrapper(controller.delete.bind(controller))
);

/**
 * @openapi
 * /api/ninos/familia/{familiaId}:
 *   get:
 *     summary: Lista niños por familia
 *     tags: [Niños]
 *     parameters:
 *       - in: path
 *         name: familiaId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       '200':
 *         description: Listado de niños
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Nino' }
 *       '404':
 *         description: No se encontraron niños para esa familia
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/NotFoundError' }
 *       '401':
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/UnauthorizedError' }
 *       '500':
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/InternalServerError' }
 */
router.get(
  '/familia/:familiaId',
  asyncMiddlewareWrapper(controller.listByFamilia.bind(controller))
);

export default router;
