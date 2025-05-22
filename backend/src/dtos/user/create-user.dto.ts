import { IsOptional, IsString, MaxLength, IsNotEmpty, IsEmail, MinLength } from "class-validator";

// DTO para crear un nuevo usuario
// Nota: los decoradores se aplican de último a primero


export class CreateUserDto { 
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @MaxLength(100, { message: 'El nombre no debe exceder los 100 caracteres.' })
    @IsOptional()
    nombre?: string;

    @IsString({ message: 'Los apellidos deben ser una cadena de texto.' })
    @MaxLength(100, { message: 'Los apellidos no deben exceder los 100 caracteres.' })
    @IsOptional() 
    apellidos?: string;

    @IsEmail({}, { message: 'El email no tiene un formato válido.' })
    @IsNotEmpty({ message: 'El email es obligatorio.' })
    email!: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MaxLength(255, { message: 'La contraseña no debe exceder los 255 caracteres.' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    password!: string;
}