import { IsDate,  IsString, MaxLength } from "class-validator";

export class CreateVacunaDto {
  
    @IsString()
    @MaxLength(100)
    nombre!: string;
    
    @IsDate()   
    fecha!: Date;
}
