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
export interface IInvitacion {
  id: number;
  familyId: number;
  senderId: number;
  destinationEmail: string;
  familyDescription: string; // Descripción de la familia, si es necesario
  role: 'admin' | 'cuidador' | string; // ajusta si tienes tipos específicos
  attended: boolean;
  accepted: boolean;
  sentAt: string; // o Date si lo parseas
}

export interface IInvitacionesResponse {
  invitations: IInvitacion[];
}
