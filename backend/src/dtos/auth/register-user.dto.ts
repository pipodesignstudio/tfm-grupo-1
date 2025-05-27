import { IsString, MaxLength, IsNotEmpty, IsEmail, MinLength } from "class-validator";

// DTO para crear un nuevo usuario
// Nota: los decoradores se aplican de último a primero

export class RegisterUserDto { 
    @IsNotEmpty({ message: 'El nick de usuario es obligatorio.' })
    @IsString({ message: 'El nick de usuario debe ser una cadena de texto.' })
    @MaxLength(50, { message: 'El nick de usuario no debe exceder los 50 caracteres.' })
    nick!: string;

    @IsEmail({}, { message: 'El email no tiene un formato válido.' })
    @IsNotEmpty({ message: 'El email es obligatorio.' })
    email!: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MaxLength(255, { message: 'La contraseña no debe exceder los 255 caracteres.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    contrasena!: string;
}