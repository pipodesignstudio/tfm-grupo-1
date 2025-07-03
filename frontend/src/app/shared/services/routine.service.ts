import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { IRoutine } from '../interfaces';
import { TokenService } from '../../features/auth/services'; 

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly apiUrl = 'http://localhost:3000/api/ninos';
  private readonly tokenService = inject(TokenService);

  private getAuthHeader() {
    const token = this.tokenService.token();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getAllRoutines(idNino: number): Promise<IRoutine[]> {
    const response = await axios.get<{ data: IRoutine[] }>(
      `${this.apiUrl}/${idNino}/rutinas`,
      this.getAuthHeader()
    );
    return response.data.data; // accedemos al .data que está dentro del { data: [...] }
  }

  async getRoutine(idNino: number, idRutina: number): Promise<IRoutine> {
    const response = await axios.get<{ data: IRoutine }>(
      `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
      this.getAuthHeader()
    );
    return response.data.data;
  }

  async crearRutina(idNino: number, data: any): Promise<any> {
    const response = await axios.post(
      `${this.apiUrl}/${idNino}/rutinas`,
      data,
      this.getAuthHeader()
    );
    return response.data;
  }

  async updateRoutine(idNino: number, idRutina: number, data: any): Promise<any> {
    const response = await axios.put(
      `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
      data,
      this.getAuthHeader()
    );
    return response.data;
  }

  async deleteRoutine(idNino: number, idRutina: number): Promise<any> {
    const response = await axios.delete(
      `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
      this.getAuthHeader()
    );
    return response.data;
  }
}
