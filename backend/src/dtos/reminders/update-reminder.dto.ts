import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPositive } from "class-validator";

export class UpdateReminderDto {
    @IsNumber({},{message:"El ID debe ser un número."})
    @IsPositive({message:"El ID debe ser un número positivo."})
    @IsNotEmpty({message:"El ID es obligatorio."})
    remiderId!: number;

    @IsOptional()
    @IsIn(["daily", "weekly", "monthly"],{message:"La periodicidad debe ser de un tipo válido"})
    periodicidad?: 'daily' | 'weekly' | 'monthly';

    @IsOptional()
    @IsBoolean()
    activo?: boolean;
}