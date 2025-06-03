import { Router } from "express";
import { asyncMiddlewareWrapper } from "../utils";
import { authMiddleware } from "../middlewares";
import { SuggestionsController } from "../controllers";

const suggestionsController = new SuggestionsController();

const suggestionsRoute = Router();

/**
 * @openapi
 * /api/suggestions:
 *   get:
 *     summary: Obtiene sugerencias basadas en el perfil del usuario
 *     tags:
 *       - Sugerencias
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Sugerencias generadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuggestionsSuccessSchema'
 *       '401':
 *         description: El usuario no está autenticado o el token ha caducado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedErrorSchema'
 */

suggestionsRoute.get(
  "/",
  asyncMiddlewareWrapper(authMiddleware),
  suggestionsController.getSuggestions
);

export default suggestionsRoute;
