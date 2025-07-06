import { IsString } from "class-validator";

export class PerfilAprendizajeDto {
    @IsString()
    nombre!: string;
    @IsString()
    descripcion!: string;
}
