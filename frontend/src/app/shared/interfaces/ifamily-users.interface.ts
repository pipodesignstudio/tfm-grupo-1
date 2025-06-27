import { IUser } from './iuser.interface';

export interface IFamiliaUsuario {
  familia_id: number;
  usuarios_id: number;
  rol: 'admin' | 'cuidador'; // puedes ampliar si hay más roles
  usuarios: IUser;
}