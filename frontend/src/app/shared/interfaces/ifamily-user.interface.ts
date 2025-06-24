export type UserRole = 'admin' | 'cuidador' | 'nino';

export interface IFamilyUser {
  familiaId: number;
  usuariosId: number;
  rol: UserRole;
}
