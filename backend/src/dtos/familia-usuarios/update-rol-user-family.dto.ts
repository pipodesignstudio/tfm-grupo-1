import { IsEnum, IsInt } from 'class-validator';
import { FamiliaUsuariosRol } from './rol-user-family.dto';

/**
 * DTO para actualizar el rol de un usuario en una familia
 */
export class UpdateRolUsuarioDto {
  @IsEnum(FamiliaUsuariosRol, {
    message: 'El rol debe ser admin, cuidador o niño',
  })
  rol!: FamiliaUsuariosRol;
}