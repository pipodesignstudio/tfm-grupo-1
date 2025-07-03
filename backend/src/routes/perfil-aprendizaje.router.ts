import { Router } from "express";
import { authMiddleware, validationMiddleware } from "../middlewares";
import { asyncMiddlewareWrapper } from "../utils";
import { PerfilAprendizajeController } from "../controllers";
import { PerfilAprendizajeDto } from "../dtos";

const perfilAprendizajeRouter = Router();
const controller = new PerfilAprendizajeController();


perfilAprendizajeRouter.post(
    "/",
    asyncMiddlewareWrapper(authMiddleware),
    validationMiddleware(PerfilAprendizajeDto),
    controller.create
);

export default perfilAprendizajeRouter;