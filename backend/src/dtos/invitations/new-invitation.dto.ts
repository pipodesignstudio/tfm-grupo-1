import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class NewInvitationDto {
  @IsEmail({}, { message: "El email no tiene un formato válido." })
  @IsNotEmpty({ message: "El email es obligatorio." })
  destinationEmail!: string;

  @IsPositive({ message: "El ID debe ser un número positivo." })
  @IsNumber({}, { message: "El ID debe ser un número." })
  @IsNotEmpty({ message: "El ID es obligatorio." })
  familyId!: number;

  @IsString({ message: "El rol debe ser una cadena de texto." })
  @IsNotEmpty({ message: "El rol es obligatorio." })
  @IsIn(["admin", "cuidador", "nino"], {
    message: "El rol debe ser de un tipo válido",
  })
  role!: "admin" | "cuidador" | "nino";
}
