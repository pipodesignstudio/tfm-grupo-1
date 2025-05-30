import { Request, Response } from "express";
import { SuggestionsService } from "../services";

const suggestionsService = new SuggestionsService();

export class SuggestionsController {
    

    async getSuggestions(req:Request, res:Response) {
        const reqUser = req.user!;
        const suggestions = await suggestionsService.buildSuggestions(reqUser.id);
        res.json(suggestions);
    }

}