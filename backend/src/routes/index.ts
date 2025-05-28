import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./users.route";


const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);


export default apiRouter;