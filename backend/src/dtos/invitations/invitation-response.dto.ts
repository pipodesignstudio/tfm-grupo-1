import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class InvitationResponseDto {
    @IsNumber({}, { message: "El ID debe ser un número." })
    @IsPositive({ message: "El ID debe ser un número positivo." })
    @IsNotEmpty({ message: "El ID es obligatorio." })
    invitationId!: number;

    @IsBoolean({ message: "El estado debe ser un booleano." })
    @IsNotEmpty({ message: "El estado es obligatorio." })
    isAccepted!: boolean;
}