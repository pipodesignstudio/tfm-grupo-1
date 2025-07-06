import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateEnfermedadDto {
    @IsString()
    @MaxLength(100)
    @IsOptional()
    nombre?: string;
    
    @IsString()
    @MaxLength(100)
    @IsOptional()
    doctor?: string;
}
