import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsDateString,
  IsInt,
} from "class-validator";

import { Type } from 'class-transformer';

import { UbicacionDto } from "./ubicacion.dto";




export class CreateActividadDto {

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

  @IsOptional()
  @IsInt()
  @IsPositive()
  objetivo_id?: number;

  @IsDateString()
  @IsNotEmpty({ message: "La fecha de realización es obligatoria." })
  fecha_realizacion!: Date;

  @IsDateString()
  @IsNotEmpty({ message: "La hora de inicio es obligatoria." })
  hora_inicio!: Date;

  @IsDateString()
  @IsOptional()
  hora_fin?: Date;

  @IsOptional()
  @IsString({ message: "El color debe ser una cadena de texto." })
  color?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion?: UbicacionDto;


  @IsOptional()
  @IsBoolean()
  completado?: boolean;

  @IsIn(["Objetivo", "Rutina", "Evento"], {
    message: 'El tipo de actividad debe ser "Objetivo", "Rutina" o "Evento".',
  })
  @IsString({ message: "El tipo de actividad debe ser una cadena de texto." })
  @IsNotEmpty({ message: "El tipo de actividad es obligatorio." })
  tipo!: "Objetivo" | "Rutina" | "Evento";
}

