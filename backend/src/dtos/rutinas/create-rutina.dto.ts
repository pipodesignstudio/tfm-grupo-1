import { IsString, MaxLength, IsOptional, IsDateString, IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class CreateRutinaDto {
  @IsString() @MaxLength(100) nombre!: string;
  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() frecuencia?: any;
  @IsOptional() @IsDateString() fecha_fin?: string;
  @IsOptional() @IsArray() @ArrayNotEmpty() @IsInt({ each: true }) actividades_ids?: number[];
}
