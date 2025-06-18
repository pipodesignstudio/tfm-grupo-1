import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, IsDateString, Min } from 'class-validator';

export class CreateNinoDto {
  @IsInt() perfiles_aprendizaje_id!: number;
  @IsInt() familia_id!: number;

  @IsString() @MaxLength(100) @IsNotEmpty() nombre!: string;
  @IsString() @MaxLength(100) @IsNotEmpty() apellido!: string;

  @IsDateString() fecha_nacimiento!: string;

  @IsOptional() @IsString() descripcion?: string;
  @IsOptional() @IsString() genero?: string;
  @IsOptional() @IsInt() @Min(0) peso?: number;
  @IsOptional() @IsInt() @Min(0) altura?: number;
  @IsOptional() img_perfil?: string; // Base64 opcional
}