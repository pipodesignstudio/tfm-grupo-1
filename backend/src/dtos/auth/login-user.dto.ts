import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class LoginUserDto {
  @IsNotEmpty({ message: "El email es obligatorio." })
  @IsEmail({}, { message: "El email no tiene un formato válido." })
  email!: string;

  @IsString({ message: "La contraseña debe ser una cadena de texto." })
  @MinLength(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  @MaxLength(255, {
    message: "La contraseña no puede exceder los 255 caracteres.",
  })
  @IsNotEmpty({ message: "La contraseña es obligatoria." })
  password!: string;
}