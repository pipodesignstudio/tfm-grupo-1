import { IsDateString, IsString, MaxLength } from "class-validator";

export class UpdateVacunaDto {
    @IsString()
    @MaxLength(100)
    nombre!: string;
    
    @IsDateString()
    fecha!: string;
}
