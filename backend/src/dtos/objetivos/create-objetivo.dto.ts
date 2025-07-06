import { IsString, MaxLength, IsOptional, IsDateString, IsArray, IsInt, ArrayNotEmpty } from 'class-validator';

export class CreateObjetivoDto {
  @IsString() @MaxLength(45) nombre!: string;
  @IsOptional() @IsString() @MaxLength(45) color?: string;
  @IsOptional() @IsString() @MaxLength(45) tipo?: string;
  @IsOptional() @IsDateString() fecha_fin?: string;

  /** IDs de actividades que se asociarán al crear el objetivo */
  @IsOptional() @IsArray() @ArrayNotEmpty() @IsInt({ each: true }) actividades_ids?: number[];
}
