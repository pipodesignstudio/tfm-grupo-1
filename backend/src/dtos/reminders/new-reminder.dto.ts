import { IsIn, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class NewReminderDto {
    @IsPositive({ message: "El ID debe ser un número positivo." })
    @IsNotEmpty({ message: "La actividad es obligatoria." })
    @IsNumber({}, { message: "El ID debe ser un número." })
    actividadId!:number;

    @IsNotEmpty({ message: "La periodicidad es obligatoria." })
      @IsIn(["daily", "weekly", "monthly"], {
        message: "La periodicidad debe ser de un tipo válido",
      })
    periodicidad!: 'daily' | 'weekly' | 'monthly';

}