import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./users.route";
import suggestionsRoute from "./suggestions.route";
import invitationsRoute from "./invitations.route";
import remindersRoute from "./reminders.route";
import alergiaRoutes from "./alergia.router";
import actividadRoutes from "./actividad.router";
import notesRoute from "./notes.routes";
import familiaRoutes from "./familia.routes";

import ninoRoutes from "./ninos.router";
import objetivosRouter from "./objetivos.router";
import rutinasRouter from "./rutinas.router";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/suggestions", suggestionsRoute);
apiRouter.use("/invitations", invitationsRoute);
apiRouter.use("/reminders", remindersRoute);
apiRouter.use("/ninos", ninoRoutes);
apiRouter.use("/ninos/:id_nino/alergias", alergiaRoutes);
apiRouter.use("/actividades", actividadRoutes);
apiRouter.use('/ninos/:id_nino/objetivos', objetivosRouter);
apiRouter.use('/ninos/:id_nino/rutinas', rutinasRouter);
apiRouter.use("/notes", notesRoute);
apiRouter.use("/api/familia", familiaRoutes);

export default apiRouter;