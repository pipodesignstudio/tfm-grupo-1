import { IFamiliaUsuario } from './../interfaces/ifamily-users.interface';
import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { TokenService } from '../../features/auth/services';
import { FamiliesStore } from './familiesStore.service';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private apiUrl: string = 'http://localhost:3000/api';

  private readonly tokenService = inject(TokenService);
  private readonly familiesStore = inject(FamiliesStore);


  async createFamily(descripcion:string): Promise<{ data: { id: number } }> {
    const response = await axios.post(
      `${this.apiUrl}/familia`,
      { descripcion },
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    console.log(response.data.data.id);
    this.familiesStore.setFamilyFirstTime(response.data.data.id);
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
