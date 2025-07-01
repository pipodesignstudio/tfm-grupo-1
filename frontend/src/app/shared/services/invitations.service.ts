import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { TokenService } from '../../features/auth/services';
import { IInvitacionesResponse } from '../interfaces/iinvitation.interface';



@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private apiUrl: string = 'http://localhost:3000/api';

    private readonly tokenService = inject(TokenService);


  async sendInvitationUser(invitation: { id_familia: number; emailDestinatario: string; rol: 'admin' | 'cuidador' }): Promise<any> {
    const response = await axios.post<{ data: any }>(
      `${this.apiUrl}/invitations/send`,
      {
        familyId: invitation.id_familia,
        destinationEmail: invitation.emailDestinatario,
        role: invitation.rol,
      },
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data
  }

  async getReceivedInvitations(): Promise<IInvitacionesResponse> {
    const response = await axios.get<{ data: IInvitacionesResponse }>(
      `${this.apiUrl}/invitations/received`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  async getSentInvitations(): Promise<IInvitacionesResponse> {
    const response = await axios.get<{ data: IInvitacionesResponse }>(
      `${this.apiUrl}/invitations/sent`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  async respondInvitation(invitationId: number, isAccepted: boolean): Promise<any> { 
    const response = await axios.post<{ data: any }>(
      `${this.apiUrl}/invitations/respond`,
      {
        invitationId: invitationId,
        isAccepted: isAccepted,
      },
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data;
  }

}
