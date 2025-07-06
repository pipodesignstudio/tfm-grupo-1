import prisma from "../config/prisma.config";
import { IActividad } from "../interfaces/actividad.interface";
import { IAService } from "./ia.service";

const ai = new IAService();

export class SuggestionsService {
    async buildSuggestions(id:number) {
        const activities:IActividad[] = await prisma.actividades.findMany({take:5});

        const suggestions = await ai.generateAISuggestions(activities);
        return suggestions;
    }
}