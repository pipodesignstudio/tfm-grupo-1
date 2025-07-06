import { IsInt, IsOptional, IsString, MaxLength, IsDateString, Min, IsNumber } from 'class-validator';

export class UpdateNinoDto {
  @IsOptional() @IsInt() perfiles_aprendizaje_id?: number;
  @IsOptional() @IsInt() familia_id?: number;

  @IsOptional() @IsString() @MaxLength(100) nombre?: string;
  @IsOptional() @IsString() @MaxLength(100) apellido?: string;

  @IsOptional() @IsDateString() fecha_nacimiento?: string;

  @IsOptional() @IsString() descripcion?: string | null;
  @IsOptional() @IsString() genero?: string | null;
  @IsOptional() @IsNumber() @Min(0) peso?: number | null;
  @IsOptional() @IsInt() @Min(0) altura?: number | null;
  @IsOptional() img_perfil?: string | null;
}