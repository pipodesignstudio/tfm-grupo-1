import { IsString, IsOptional } from 'class-validator';

/**
 * DTO para actualizar una familia existente
 */
export class UpdateFamiliaDto {
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  descripcion?: string;
}