import { Router } from "express";

import authRoutes from "./auth.route";
import userRoutes from "./users.route";
import suggestionsRoute from "./suggestions.route";
import invitationsRoute from "./invitations.route";
import remindersRoute from "./reminders.route";
import notesRoute from "./notes.routes";


const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/suggestions", suggestionsRoute);
apiRouter.use("/invitations", invitationsRoute);
apiRouter.use("/reminders", remindersRoute);
apiRouter.use("/notes", notesRoute);

export default apiRouter;