// src/routes/authRoutes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares';
import { LoginUserDto, RegisterUserDto } from '../dtos';

const router = Router();
const authController = new AuthController();

// Registrar usuarios
router.post('/register', validationMiddleware(RegisterUserDto), authController.register);

// Login de usuarios
router.post('/login', validationMiddleware(LoginUserDto), authController.login);

export default router;