// src/routes/authRoutes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validationMiddleware } from "../middlewares";
import { LoginUserDto, RegisterUserDto } from "../dtos";

const router = Router();
const authController = new AuthController();



/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Autenticación
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

router.post(
  "/register",
  validationMiddleware(RegisterUserDto),
  authController.register
);


/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión del usuario y devuelve token temporal
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserDto'
 *     responses:
 *       '200':
 *         description: Usuario logeado exitosamente. Devuelve token en la data
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
 */
// Login de usuarios
router.post("/login", validationMiddleware(LoginUserDto), authController.login);

export default router;
