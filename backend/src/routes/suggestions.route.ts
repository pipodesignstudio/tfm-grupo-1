import { Router } from "express";
import { asyncMiddlewareWrapper } from "../utils";
import { authMiddleware } from "../middlewares";
import { SuggestionsController } from "../controllers";

const suggestionsController = new SuggestionsController();

const suggestionsRoute = Router();


suggestionsRoute.get("/", asyncMiddlewareWrapper(authMiddleware), suggestionsController.getSuggestions);

export default suggestionsRoute;