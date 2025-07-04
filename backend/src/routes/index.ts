import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./users.route";
import suggestionsRoute from "./suggestions.route";
import invitationsRoute from "./invitations.route";
import remindersRoute from "./reminders.route";
import saludRoutes from "./salud.router";
import actividadRoutes from "./actividad.router";
import notesRoute from "./notes.routes";
import familiaRoutes from "./familia.routes";
import familiaUsuariosRoutes from "./familia-usuarios.routes";

import ninoRoutes from "./ninos.router";
import objetivosRouter from "./objetivos.router";
import rutinasRouter from "./rutinas.router";
import perfilAprendizajeRouter from "./perfil-aprendizaje.router";

const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/suggestions", suggestionsRoute);
apiRouter.use("/invitations", invitationsRoute);
apiRouter.use("/reminders", remindersRoute);
apiRouter.use("/ninos", ninoRoutes);
apiRouter.use("/ninos/:id_nino/salud", saludRoutes);
apiRouter.use("/actividades", actividadRoutes);
apiRouter.use("/ninos/:id_nino/objetivos", objetivosRouter);
apiRouter.use("/ninos/:id_nino/rutinas", rutinasRouter);
apiRouter.use("/notes", notesRoute);
apiRouter.use("/perfil-aprendizaje", perfilAprendizajeRouter);
apiRouter.use("/familia", familiaRoutes);
apiRouter.use("/familia/:id/usuarios", familiaUsuariosRoutes);

export default apiRouter;
