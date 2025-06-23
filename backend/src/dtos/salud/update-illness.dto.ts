import { IsString, MaxLength } from "class-validator";

export class UpdateEnfermedadDto {
    @IsString()
    @MaxLength(100)
    nombre!: string;
    
    @IsString()
    @MaxLength(100)
    doctor!: string;
}
