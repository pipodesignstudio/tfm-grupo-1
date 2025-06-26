import { Router } from 'express';
import { FamiliaUsuariosController } from '../controllers/familia-usuarios.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { authMiddleware, validationMiddleware } from '../middlewares';
import { AddUsuarioFamiliaDto, UpdateRolUsuarioDto } from '../dtos/familia-usuarios';

const familiaUsuariosRoutes = Router({ mergeParams: true });
const controller = new FamiliaUsuariosController();

/**
 * GET - Obtener todos los usuarios de una familia
 */
/**
 * @openapi
 * /familia/{id}/usuarios:
 *   get:
 *     summary: Obtener los usuarios de una familia
 *     tags:
 *       - FamiliaUsuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la familia
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida
 */
familiaUsuariosRoutes.get(
  '/',
/*   asyncMiddlewareWrapper(authMiddleware),
 */  controller.getAll
);

/**
 * POST - Añadir un nuevo usuario a una familia
 */
/**
 * @openapi
 * /familia/{id}/usuarios:
 *   post:
 *     summary: Añadir un usuario a la familia
 *     tags:
 *       - FamiliaUsuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la familia
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddUsuarioFamiliaDto'
 *     responses:
 *       '201':
 *         description: Usuario añadido a la familia
 */
familiaUsuariosRoutes.post(
  '/',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(AddUsuarioFamiliaDto),
  controller.create
);

/**
 * PUT - Cambiar el rol de un usuario en la familia
 */
/**
 * @openapi
 * /familia/{id}/usuarios/{usuarioId}:
 *   put:
 *     summary: Cambiar el rol de un usuario en la familia
 *     tags:
 *       - FamiliaUsuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: usuarioId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRolUsuarioDto'
 *     responses:
 *       '200':
 *         description: Rol actualizado
 */
familiaUsuariosRoutes.put(
  '/:usuarioId',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(UpdateRolUsuarioDto),
  controller.changeRol
);

/**
 * DELETE - Eliminar un usuario de la familia
 */
/**
 * @openapi
 * /familia/{id}/usuarios/{usuarioId}:
 *   delete:
 *     summary: Eliminar un usuario de la familia
 *     tags:
 *       - FamiliaUsuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: usuarioId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Usuario eliminado de la familia
 */
familiaUsuariosRoutes.delete(
  '/:usuarioId',
  asyncMiddlewareWrapper(authMiddleware),
  controller.delete
);

export default familiaUsuariosRoutes;
