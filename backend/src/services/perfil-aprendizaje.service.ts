import prisma from "../config/prisma.config";
import { PerfilAprendizajeDto } from "../dtos";
import { InternalServerError } from "../utils";

export class PerfilAprendizajeService {
public async create(dto: PerfilAprendizajeDto) {
    try {
        const {id} = await prisma.perfiles_aprendizaje.create({ data: dto });
        return id;
    } catch (error) {
        console.log(error);
        throw new InternalServerError("Error al crear perfil de aprendizaje", {
            error: "INTERNAL_SERVER_ERROR",
        });
    }
}
    
}
