import { IFamiliaUsuario } from './../interfaces/ifamily-users.interface';
import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { TokenService } from '../../features/auth/services';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private apiUrl: string = 'http://localhost:3000/api';

  private readonly tokenService = inject(TokenService);

  async createFamily(): Promise<{ data: { id: number } }> {
    const response = await axios.post(
      `${this.apiUrl}/familia`,
      { descripcion: 'Familia creada automáticamente' },
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data;
  }

  async getAllUsersFamily(id_familia: string): Promise<IFamiliaUsuario[]> {
    const response = await axios.get<{ data: IFamiliaUsuario[] }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }
}
