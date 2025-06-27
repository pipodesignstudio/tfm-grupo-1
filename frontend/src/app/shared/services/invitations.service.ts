import { Injectable } from '@angular/core';
import axios from 'axios';



@Injectable({
  providedIn: 'root',
})
export class InvitationsService {
  private apiUrl: string = 'http://localhost:3000/api';

  async sendInvitationUser(id_familia: string): Promise<any> {
    const response = await axios.post<{ data: any }>(
      `${this.apiUrl}/invitations/send`
    );
    return response.data
  }


}
