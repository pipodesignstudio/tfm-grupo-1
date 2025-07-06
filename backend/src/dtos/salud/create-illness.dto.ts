import { IsNumber, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateEnfermedadDto {
  
    @IsString()
    @MaxLength(100)
    nombre!: string;
    
    @IsString()
    @MaxLength(100)
    doctor!: string;
}
