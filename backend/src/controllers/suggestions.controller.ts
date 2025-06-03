import { Request, Response } from "express";
import { SuggestionsService } from "../services";
import { ApiCorrectResponse, InternalServerError } from "../utils";

const suggestionsService = new SuggestionsService();

export class SuggestionsController {
    

    async getSuggestions(req:Request, res:Response) {
        const reqUser = req.user!;
        const suggestions = await suggestionsService.buildSuggestions(reqUser.id);
        if (!suggestions.length)
            throw new InternalServerError("No se han podido generar sugerencias.", { error: "INTERNAL_SERVER_ERROR" });
        ApiCorrectResponse.genericSuccess(res, suggestions, true, "Sugerencias generadas con exito", 200);
    }

}