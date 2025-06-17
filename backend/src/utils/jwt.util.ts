// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interfaces';

dotenv.config(); 

// Verificar que las variables de entorno existen
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET no está definido en las variables de entorno.');
    process.exit(1); 
}

/**
 * Genera un JSON Web Token (JWT) para un usuario.
 * @param user interfaz de usuario del sistema. Coincide con prisma.
 * @returns Un token JWT en formato string
 */
export const generateJwtToken = (user: IUser): string => {
    // Hacer el cast explícito a number

    // Si metemos roles podemos hacer que el jwt devuelva el rol
    const payload = {
        id: user.id,
        email: user.email,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    return token;
};