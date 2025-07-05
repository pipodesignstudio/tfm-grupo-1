import { Request, Response, NextFunction } from 'express';
import { PerfilAprendizajeService } from "../services";
import { PerfilAprendizajeDto } from "../dtos";
import { ApiCorrectResponse } from "../utils";

const perfilAprendizajeService = new PerfilAprendizajeService();
export class PerfilAprendizajeController {
    
    public async create(req: Request, res: Response, next: NextFunction) {
        console.log("Recurso impactado")
        try {
            const id = await perfilAprendizajeService.create(req.body as PerfilAprendizajeDto);
            ApiCorrectResponse.genericSuccess(res, id, true, "Perfil de aprendizaje creado exitosamente", 201);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}
