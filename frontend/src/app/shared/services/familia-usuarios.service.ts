import { Injectable } from '@angular/core';
import axios from 'axios';



@Injectable({
  providedIn: 'root',
})
export class FamiliaUsuariosService {
  private apiUrl: string = 'http://localhost:3000/api';

  async editarUsuarioFamilia(id_familia: number, id_usuario: number, rol: 'cuidador' | 'admin'): Promise<any> {
    const response = await axios.put<{ data: any }>(
      `${this.apiUrl}/familia/${id_familia}/usuarios/${id_usuario}`,
      { rol }
    );
    return response.data
  }

    async eliminarUsuarioFamilia(id_familia: number, id_usuario: number): Promise<any> {
        const response = await axios.delete<{ data: any }>(
        `${this.apiUrl}/familia/${id_familia}/usuarios/${id_usuario}`
        );
        return response.data;
    }


}
