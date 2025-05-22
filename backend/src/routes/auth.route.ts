// src/routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares';
import { CreateUserDto } from '../dtos';

const router = Router();
const authController = new AuthController();

// Aplica el middleware de validación ANTES de que el controlador `register` se ejecute.
// Si la validación falla, el `errorHandler` se encargará de la respuesta.
// Si la validación pasa, `req.body` estará tipado y el controlador se ejecutará.
router.post('/register', validationMiddleware(CreateUserDto), authController.register);

export default router;