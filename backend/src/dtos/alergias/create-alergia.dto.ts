import { IsString, Length } from 'class-validator';

export class CreateAlergiaDto {
  @IsString()
  @Length(1, 100)
  nombre!: string;
}