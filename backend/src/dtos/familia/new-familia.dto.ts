import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO para crear una nueva familia
 */
export class NewFamiliaDto {
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion!: string;
}