import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateVacunaDto {
    @IsString()
    @MaxLength(100)
    @IsOptional()
    nombre?: string;
    
    @IsDateString()
    @IsOptional()
    fecha?: string;
}
