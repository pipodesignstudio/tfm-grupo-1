import prisma from "../config/prisma.config";

export class SuggestionsService {
    async buildSuggestions(id:number) {
        const activities = await prisma.actividades.findMany({
            where: {
                usuario_responsable: 1
            }
        });
        return activities;
    }
}