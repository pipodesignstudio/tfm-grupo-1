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


  /**
   * Retrieves all users associated with a specific family by its ID.
   *
   * @param id_familia - The unique identifier of the family.
   * @returns A promise that resolves to an array of `IFamiliaUsuario` objects representing the users in the family.
   * @throws Will throw an error if the HTTP request fails.
   */
  async getAllUsersFamily(id_familia: string): Promise<IFamiliaUsuario[]> {
    const response = await axios.get<{ data: IFamiliaUsuario[] }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

  /**
   * Edit description of a family by its ID.
   * @param id_familia - The unique identifier of the family.
   * @param descripcion - The new description for the family.
   * @returns A promise that resolves to the updated family data.
   * @throws Will throw an error if the HTTP request fails.
   */
  async editFamilyDescription(
    id_familia: number,
    descripcion: string
  ): Promise<IFamiliaUsuario> {
    const response = await axios.put<{ data: IFamiliaUsuario }>(
      `${this.apiUrl}/familia/${id_familia}`,
      { descripcion },
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data.data;
  }

}