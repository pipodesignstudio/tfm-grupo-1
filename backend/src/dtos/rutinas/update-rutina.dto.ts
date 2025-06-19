import { IsString, MaxLength, IsOptional, IsDateString, IsArray, IsInt } from 'class-validator';

export class UpdateRutinaDto {
  @IsOptional() @IsString() @MaxLength(100) nombre?: string;
  @IsOptional() @IsString() descripcion?: string | null;
  @IsOptional() frecuencia?: any | null;
  @IsOptional() @IsDateString() fecha_fin?: string | null;
  @IsOptional() @IsArray() @IsInt({ each: true }) actividades_ids?: number[] | null;
}
