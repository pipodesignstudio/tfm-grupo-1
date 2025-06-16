import { JsonValue } from "@prisma/client/runtime/library";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsBoolean,
  IsJSON,
  IsDate,
} from "class-validator";

export class UpdateActividadDto {

  @IsNumber({}, { message: "El ID de la actividad debe ser un número." })
  @IsPositive({ message: "El ID de la actividad debe ser un número positivo." })
  @IsNotEmpty({ message: "El ID de la actividad es obligatorio." })
  nino_id!: number; 

  @IsOptional()
  @IsNumber({}, { message: "El ID de la actividad debe ser un número." })
  @IsPositive({ message: "El ID de la actividad debe ser un número positivo." })
  rutina_id?: number; 

  @IsString({ message: "El título debe ser una cadena de texto." })
  @IsNotEmpty({ message: "El título es obligatorio." })
  titulo!: string;

  @IsString({ message: "La descripción debe ser una cadena de texto." })
  @IsOptional()
  descripcion?: string;

  @IsDate({ message: "La fecha de realización debe ser una fecha válida." })
  @IsNotEmpty({ message: "La fecha de realización es obligatoria." })
  fecha_realizacion!: Date;

  @IsDate({ message: "La hora de inicio debe ser una fecha válida." })
  @IsNotEmpty({ message: "La hora de inicio es obligatoria." })
  hora_inicio!: Date;

  @IsDate({ message: "La hora de finalización debe ser una fecha válida." })
  @IsNotEmpty({ message: "La hora de finalización es obligatoria." })
  hora_fin!: Date;

  @IsOptional()
  @IsString({ message: "El color debe ser una cadena de texto." })
  color?: string; 

  @IsOptional()
  @IsJSON({ message: "La ubicación debe ser un objeto JSON válido." })
  ubicacion?: JsonValue; 

  @IsNumber({}, { message: "El ID del usuario responsable debe ser un número." })
  @IsPositive({ message: "El ID del usuario responsable debe ser un número positivo." })
  @IsNotEmpty({ message: "El ID del usuario responsable es obligatorio." })
  usuario_responsable!: number; 
  
  @IsOptional()
  @IsBoolean()
  completado?: boolean; 

  @IsIn(['Objetivo', 'Rutina', 'Evento'], { message: 'El tipo de actividad debe ser "Objetivo", "Rutina" o "Evento".' })
  @IsString({ message: 'El tipo de actividad debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El tipo de actividad es obligatorio.' })
  tipo!: 'Objetivo' | 'Rutina' | 'Evento';
}