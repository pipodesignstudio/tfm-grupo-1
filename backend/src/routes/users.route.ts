import { Router } from "express";
import { UsersController } from "../controllers";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { Request, Response, NextFunction } from 'express';
import { asyncMiddlewareWrapper } from "../utils";
import { UpdateUserDto } from "../dtos";


const router = Router();

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
 *               $ref: '#/components/schemas/ConflictError'
 */
router.get('/profile', asyncMiddlewareWrapper(authMiddleware), usersController.retrieveUserDataFromToken);

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
 *               $ref: '#/components/schemas/ConflictError'
 */
router.patch('/complete-onboarding', asyncMiddlewareWrapper(authMiddleware), usersController.completeOnboarding);


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
 *               $ref: '#/components/schemas/ConflictError'
 */
router.patch('/verify-email', asyncMiddlewareWrapper(authMiddleware), usersController.verifyEmail);


router.patch('/update', asyncMiddlewareWrapper(authMiddleware), validationMiddleware(UpdateUserDto), usersController.verifyEmail);


export default router;
