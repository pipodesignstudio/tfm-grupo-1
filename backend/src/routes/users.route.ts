import { Router } from "express";
import { UsersController } from "../controllers";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { asyncMiddlewareWrapper } from "../utils";
import { UpdateUserDto } from "../dtos";


const userRouter = Router();

const usersController = new UsersController();


/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Obtiene los datos de un usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSuccessResponse'
 *       '404':
 *         description: No se ha encontrado el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
userRouter.get('/profile', asyncMiddlewareWrapper(authMiddleware), usersController.retrieveUserDataFromToken);

/**
 * @openapi
 * /api/users/complete-onboarding:
 *   patch:
 *     summary: Confirma que el usuario ya no debe volver a ver el walktrough
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: No se ha encontrado el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
userRouter.patch('/complete-onboarding', asyncMiddlewareWrapper(authMiddleware), usersController.completeOnboarding);

/**
 * @openapi
 * /api/users/verify-email/{email}:
 *   patch:
 *     summary: Confirma que el usuario ya no debe volver a ver el walktrough
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Email verificado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: No se ha encontrado el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
userRouter.patch('/verify-email/:email', asyncMiddlewareWrapper(authMiddleware), usersController.verifyEmail);

/**
 * @openapi
 * /api/users/update:
 *   patch:
 *     summary: Actualiza al usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       '200':
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSuccessResponse'
 *       '400':
 *          description: Solicitud inválida
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/BadRequestError'
 *       '404':
 *         description: No se ha encontrado el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
userRouter.patch('/update', asyncMiddlewareWrapper(authMiddleware), validationMiddleware(UpdateUserDto), usersController.updateProfile);


/**
 * @openapi
 * /api/users/delete:
 *   delete:
 *     summary: Borra la cuenta del usuario
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Usuario borrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: No se ha encontrado el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
userRouter.delete('/delete', asyncMiddlewareWrapper(authMiddleware), usersController.deleteUser);


/**
 * @openapi
 * /api/users/verify-email/{email}:
 *   get:
 *     summary: Verifica si el email necesita ser verificado
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       '200':
 *         description: Email verificado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '404':
 *         description: No se ha encontrado el usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 */
userRouter.get('/verify-email/:email', asyncMiddlewareWrapper(authMiddleware), usersController.checkIfEmailNeedsToBeVerified);


/**
 * @openapi
 * /api/users/familias:
 *   get:
 *     summary: Obtener las familias del usuario autenticado
 *     tags:
 *       - Usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de familias obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       descripcion:
 *                         type: string
 *                         example: Familia Pérez
 *                       rol:
 *                         type: string
 *                         example: ADMIN
 */
userRouter.get(
  '/familias',
  asyncMiddlewareWrapper(authMiddleware),
  usersController.getFamiliasDelUsuarioAutenticado.bind(usersController)
);





export default userRouter;
