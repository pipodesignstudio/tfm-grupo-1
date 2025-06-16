import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./users.route";
import suggestionsRoute from "./suggestions.route";
import invitationsRoute from "./invitations.route";
import remindersRoute from "./reminders.route";
import alergiaRoutes from "./alergia.router";
import actividadRoutes from "./actividad.router";


const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/suggestions", suggestionsRoute);
apiRouter.use("/invitations", invitationsRoute);
apiRouter.use("/reminders", remindersRoute);
apiRouter.use("/ninos/:id_nino/alergias", alergiaRoutes);
apiRouter.use("/actividades", actividadRoutes);

export default apiRouter;