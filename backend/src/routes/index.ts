import { Router } from "express";
import authRoutes from "./auth.route";


const apiRouter = Router();

apiRouter.use("/auth", authRoutes);


export default apiRouter;