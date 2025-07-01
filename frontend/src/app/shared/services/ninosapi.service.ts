import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { TokenService } from '../../features/auth/services/token.service';

@Injectable({
  providedIn: 'root',
})
export class NinosapiService {
  private apiUrl = 'http://localhost:3000/api/ninos';
  private readonly tokenService = inject(TokenService);

  async create(ninoData: any): Promise<any> {
    const response = await axios.post<{ data: any }>(this.apiUrl, ninoData, {
      headers: { Authorization: `Bearer ${this.tokenService.token()}` },
    });
    return response.data;
  }
}
