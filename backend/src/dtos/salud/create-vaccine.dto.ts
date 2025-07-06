import { IsDate,  IsDateString,  IsString, MaxLength } from "class-validator";

export class CreateVacunaDto {
  
    @IsString()
    @MaxLength(100)
    nombre!: string;
    
    @IsDateString()   
    fecha!: Date;
}
