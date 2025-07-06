import { IsNumber, IsString } from 'class-validator';


export class UbicacionDto {
  @IsString({ message: "La dirección debe ser una cadena de texto." })
  address!: string;

  @IsNumber({}, { message: "La latitud debe ser un número." })
  lat!: number;

  @IsNumber({},{ message: "La longitud debe ser un número." })
  lon!: number;
}