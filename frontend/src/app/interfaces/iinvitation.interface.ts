export type InvitationRole = 'admin' | 'cuidador' | 'nino';

export interface IInvitation {
  id: number;
  familiaId: number;
  usuarioEmisor?: number | null;
  emailDestinatario: string;
  rol: InvitationRole;
  aceptado?: boolean | null;
  fechaEnvio: string;
}
