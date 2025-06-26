import { IFamiliaUsuario } from './../interfaces/ifamily-users.interface';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private apiUrl: string = 'http://localhost:3000/api';

  async getAllUsersFamily(id_familia: string): Promise<IFamiliaUsuario[]> {
    const response = await axios.get<{ data: IFamiliaUsuario[] }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios`
    );
    return response.data.data;
  }


}