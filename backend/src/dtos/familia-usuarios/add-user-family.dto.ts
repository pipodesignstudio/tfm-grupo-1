import { IsEnum, IsInt } from 'class-validator';
import { FamiliaUsuariosRol } from './rol-user-family.dto';

/**
 * DTO para añadir un usuario a una familia
 */
export class AddUsuarioFamiliaDto {
  @IsInt({ message: 'El ID del usuario debe ser un número' })
  usuarios_id!: number;

  @IsEnum(FamiliaUsuariosRol, {
    message: 'El rol debe ser admin, cuidador o nino',
  })
  rol!: FamiliaUsuariosRol;
}