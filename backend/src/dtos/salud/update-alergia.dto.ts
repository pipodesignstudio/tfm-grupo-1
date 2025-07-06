import { IsString, Length, IsOptional } from 'class-validator';

export class UpdateAlergiaDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nombre?: string;
}