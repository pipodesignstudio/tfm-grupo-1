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

  @IsDateString()
  @IsNotEmpty({ message: "La fecha de realización es obligatoria." })
  fecha_realizacion!: Date;

  @IsDateString()
  @IsNotEmpty({ message: "La hora de inicio es obligatoria." })
  hora_inicio!: Date;

  @IsDateString()
  @IsNotEmpty({ message: "La hora de finalización es obligatoria." })
  hora_fin!: Date;

  @IsOptional()
  @IsString({ message: "El color debe ser una cadena de texto." })
  color?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UbicacionDto)
  ubicacion?: UbicacionDto;

  @IsNumber({}, { message: "El ID del usuario responsable debe ser un número." })
  @IsPositive({
    message: "El ID del usuario responsable debe ser un número positivo.",
  })
  @IsNotEmpty({ message: "El ID del usuario responsable es obligatorio." })
  usuario_responsable!: number;

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

