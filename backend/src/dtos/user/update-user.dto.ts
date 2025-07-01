
import {
  IsString,
  MaxLength,
  IsBase64,
  IsOptional
} from "class-validator";

export class UpdateUserDto {

  @IsString({ message: "El nick debe ser una cadena de texto." })
  @MaxLength(100, { message: "El nick no puede exceder los 100 caracteres." })
  nick!: string | null;

  @IsOptional()
  @IsString({ message: "El nombre debe ser una cadena de texto." })
  @MaxLength(100, { message: "El nombre no puede exceder los 50 caracteres." }) 
  nombre?: string | null; 

  @IsOptional() 
  @IsString({ message: "El apellido debe ser una cadena de texto." })
  @MaxLength(100, { message: "El apellido no puede exceder los 50 caracteres." }) 
  apellido?: string | null;

  @IsOptional() 
  @IsString({ message: "La imagen de perfil debe ser una cadena de texto (Base64)." })
  @IsBase64()

  img_perfil?: string | null; 
}