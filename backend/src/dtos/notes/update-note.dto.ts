import { IsOptional, IsString } from "class-validator";

/**
 * DTO para actualizar una nota existente
 */
export class UpdateNoteDto {
  @IsOptional()
  @IsString({ message: "El título debe ser un texto" })
  titulo?: string;

  @IsOptional()
  @IsString({ message: "El texto debe ser un texto" })
  texto?: string;
}
