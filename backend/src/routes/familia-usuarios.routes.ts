import { Router } from 'express';
import { FamiliaUsuariosController } from '../controllers/familia-usuarios.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { authMiddleware, validationMiddleware, validateIdParam } from '../middlewares';
import { AddUsuarioFamiliaDto, UpdateRolUsuarioDto } from '../dtos/familia-usuarios.dto';

const familiaUsuariosRoutes = Router();
const controller = new FamiliaUsuariosController();

/**
 * GET - Obtener los usuarios de una familia
 */
/**
/**
 * @openapi
 * /api/familias/{id}/usuarios:
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
  '/:id/usuarios',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  controller.listar
);

/**
 * POST - Añadir un usuario a la familia
 */
/**
 * @openapi
 * /api/familias/{id}/usuarios:
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
  '/:id/usuarios',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  validationMiddleware(AddUsuarioFamiliaDto),
  controller.agregar
);

/**
 * PUT - Cambiar el rol de un usuario en la familia
 */
/**
 * @openapi
 * /api/familias/{id}/usuarios/{usuarioId}:
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
  '/:id/usuarios/:usuarioId',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  validationMiddleware(UpdateRolUsuarioDto),
  controller.actualizarRol
);

/**
 * DELETE - Eliminar un usuario de la familia
 */
/**
 * @openapi
 * /api/familias/{id}/usuarios/{usuarioId}:
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
  '/:id/usuarios/:usuarioId',
  asyncMiddlewareWrapper(authMiddleware),
  validateIdParam,
  controller.eliminar
);

export default familiaUsuariosRoutes;
