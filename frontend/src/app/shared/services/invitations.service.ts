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


  /**
   * Sends an invitation to a user to join a family with a specified role.
   *
   * @param invitation - An object containing the family ID, the recipient's email address, and the role to assign ('admin' or 'cuidador').
   * @returns A promise that resolves with the response data from the invitation API.
   *
   * @example
   * await sendInvitationUser({ id_familia: 1, emailDestinatario: 'user@example.com', rol: 'cuidador' });
   */
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

  /**
   * Retrieves a list of invitations received by the user.
   * @returns A promise that resolves with the response data from the API.
   */
  async getReceivedInvitations(): Promise<IInvitacionesResponse> {
    const response = await axios.get<{ data: IInvitacionesResponse }>(
      `${this.apiUrl}/invitations/received`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  /**
   * Retrieves a list of invitations sent by the user.
   * @returns A promise that resolves with the response data from the API.
   */
  async getSentInvitations(): Promise<IInvitacionesResponse> {
    const response = await axios.get<{ data: IInvitacionesResponse }>(
      `${this.apiUrl}/invitations/sent`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  /**
   * Responds to an invitation by accepting or rejecting it.
   * @param invitationId - The unique identifier of the invitation.
   * @param isAccepted - A boolean indicating whether the invitation is accepted (true) or rejected (false).
   * @returns A promise that resolves with the response data from the API.
   */
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
