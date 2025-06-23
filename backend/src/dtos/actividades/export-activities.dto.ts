import {
    IsNumber,
    IsString,
    IsDate,
    IsBoolean,
    IsEnum,
    IsOptional,
    ValidateNested,
    IsArray,
  } from 'class-validator';
  import { Type } from 'class-transformer'; 
  
  // TODO: Revisar para validar correctamente el JSON con la librería de @Jon
  type JsonValue = any;  
  
  export class ActividadDto {
    @IsNumber()
    id!: number;
  
    @IsNumber()
    @IsOptional()
    rutina_id!: number | null;
  
    @IsNumber()
    ninos_id!: number;
  
    @IsString()
    @IsOptional()
    titulo!: string | null;
  
    @IsString()
    @IsOptional()
    descripcion!: string | null;
  
    @IsDate()
    @Type(() => Date)
    fecha_creacion!: Date;
  
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    fecha_realizacion!: Date | null;
  
    @IsDate()
    @Type(() => Date)
    hora_inicio!: Date;
  
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    hora_fin!: Date | null;
  
    @IsString()
    @IsOptional()
    color!: string | null;
  
    @IsEnum(['Objetivo', 'Rutina', 'Evento'])
    tipo!: 'Objetivo' | 'Rutina' | 'Evento';

    @IsOptional()
    ubicacion!: JsonValue | null;
  
    @IsNumber()
    usuario_responsable!: number;
  
    @IsBoolean()
    @IsOptional()
    completado!: boolean | null;
  }
  
  export class ExportActivitiesDto {
    @IsArray()
    @ValidateNested({ each: true }) 
    @Type(() => ActividadDto) 
    activities!: ActividadDto[];
  }