import { IsString, MaxLength, IsOptional, IsDateString, IsArray, IsInt } from 'class-validator';

export class UpdateObjetivoDto {
  @IsOptional() @IsString() @MaxLength(45) nombre?: string;
  @IsOptional() @IsString() @MaxLength(45) color?: string | null;
  @IsOptional() @IsString() @MaxLength(45) tipo?: string | null;
  @IsOptional() @IsDateString() fecha_fin?: string | null;

  /** Lista completa (sustitutiva) de actividades vinculadas */
  @IsOptional() @IsArray() @IsInt({ each: true }) actividades_ids?: number[] | null;
}