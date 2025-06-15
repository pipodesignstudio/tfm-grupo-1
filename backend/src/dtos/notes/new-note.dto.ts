import { IsInt, IsNotEmpty, IsString } from "class-validator";

/**
 * DTO para crear una nueva nota
 */

export class NewNoteDto {
  @IsInt({ message: "El ID del niño debe ser un número entero" })
  ninos_id!: number;

  @IsString({ message: "El título debe ser un texto" })
  @IsNotEmpty({ message: "El título no puede estar vacío" })
  titulo!: string;

  @IsString({ message: "El texto debe ser un texto" })
  @IsNotEmpty({ message: "El texto no puede estar vacío" })
  texto!: string;
}