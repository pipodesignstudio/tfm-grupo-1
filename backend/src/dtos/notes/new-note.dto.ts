import { IsNotEmpty, IsString } from "class-validator";

/**
 * DTO para crear una nueva nota
 * El ID del niño se pasa por la URL, no por el body
 */
export class NewNoteDto {
  @IsString({ message: "El título debe ser un texto" })
  @IsNotEmpty({ message: "El título no puede estar vacío" })
  titulo!: string;

  @IsString({ message: "El texto debe ser un texto" })
  @IsNotEmpty({ message: "El texto no puede estar vacío" })
  texto!: string;
}
