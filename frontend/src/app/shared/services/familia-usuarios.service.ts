import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { TokenService } from '../../features/auth/services';

@Injectable({
  providedIn: 'root',
})
export class FamiliaUsuariosService {
  private apiUrl: string = 'http://localhost:3000/api';
  private readonly tokenService = inject(TokenService);


  /**
   * Updates the role of a user within a specific family.
   *
   * @param id_familia - The unique identifier of the family.
   * @param id_usuario - The unique identifier of the user whose role is to be updated.
   * @param rol - The new role to assign to the user ('cuidador' or 'admin').
   * @returns A promise that resolves with the response data from the API.
   */
  async editarUsuarioFamilia(
    id_familia: number,
    id_usuario: number,
    rol: 'cuidador' | 'admin'
  ): Promise<any> {
    const response = await axios.put<{ data: any }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios/${id_usuario}`,
      { rol },
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data;
  }

  /**
   * Deletes a specific user from a family.
   *
   * @param id_familia - The unique identifier of the family.
   * @param id_usuario - The unique identifier of the user to be deleted.
   * @returns A promise that resolves with the response data from the API.
   */
  async eliminarUsuarioFamilia(
    id_familia: number,
    id_usuario: number
  ): Promise<any> {
    const response = await axios.delete<{ data: any }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios/${id_usuario}`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data;
  }

  /**
   * Allows a user to leave a family.
   *
   * @param id_familia - The unique identifier of the family from which the user is leaving.
   * @returns A promise that resolves with the response data from the API.
   */
  async salirDeFamilia(id_familia: number): Promise<any> {
    const response = await axios.delete<{ data: any }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios/salir`,
      {
        headers: { Authorization: `Bearer ${this.tokenService.token()}` },
      }
    );
    return response.data;
  }
}
