import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./users.route";
import suggestionsRoute from "./suggestions.route";
import invitationsRoute from "./invitations.route";


const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/suggestions", suggestionsRoute);
apiRouter.use("/invitations", invitationsRoute);

export default apiRouter;