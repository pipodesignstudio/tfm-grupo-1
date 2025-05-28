import { Router } from "express";
import { UsersController } from "../controllers";
import { authMiddleware } from "../middlewares";
import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from "../utils";


const router = Router();

const usersController = new UsersController();


/**
 * @openapi
 * /api/users/profile:
 *   get:
 *     summary: Obtiene los datos de un usuario
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserDto'
 *     responses:
 *       '200':
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       '400':
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BadRequestError'
 *       '409':
 *         description: Conflicto, recurso ya existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 */
router.get('/profile', asyncHandler(authMiddleware), usersController.retrieveUserData);



export default router;
