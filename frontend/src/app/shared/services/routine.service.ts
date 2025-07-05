import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRoutine } from '../interfaces';
import { TokenService } from '../../features/auth/services';
import axios from 'axios';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly apiUrl = 'http://localhost:3000/api/ninos';
  private readonly tokenService = inject(TokenService);

  private rutinasSubject = new BehaviorSubject<IRoutine[]>([]);
  rutinas$ = this.rutinasSubject.asObservable();

  // Obtiene los headers de autorización
  private getAuthHeader() {
    const token = this.tokenService.token();
    if (!token) {
      console.warn('[RoutineService] No se encontró un token de autenticación');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Extrae el array de rutinas de la respuesta, adaptándose a diferentes estructuras
  private extractRoutinesFromResponse(data: any): IRoutine[] {
    if (Array.isArray(data?.data?.data)) {
      return data.data.data;
    } else if (Array.isArray(data?.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return [];
    }
  }

  // Obtiene todas las rutinas de un niño usando axios
  async getAllRoutines(idNino: number): Promise<IRoutine[]> {
    console.log('[RoutineService] getAllRoutines llamada');
    try {
      const response = await axios.get(
        `${this.apiUrl}/${idNino}/rutinas`,
        { headers: this.getAuthHeader() }
      );
      console.log('AXIOS response.data:', response.data);

      const data: any = response.data;
      const rutinas = this.extractRoutinesFromResponse(data);
      this.rutinasSubject.next(rutinas);
      return rutinas;
    } catch (error) {
      console.error('[getAllRoutines] Error:', error);
      throw error;
    }
  }

  // Obtiene una rutina específica
  async getRoutine(idNino: number, idRutina: number): Promise<IRoutine> {
    console.log('[RoutineService] getRoutine llamada');
    try {
      const response = await axios.get(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        { headers: this.getAuthHeader() }
      );
      console.log('AXIOS getRoutine response.data:', response.data);

      const data: any = response.data;
      if (data && data.data !== undefined) {
        return data.data;
      }
      return data;
    } catch (error) {
      console.error('[getRoutine] Error:', error);
      throw error;
    }
  }

  // Crea una nueva rutina y recarga la lista
  async crearRutina(idNino: number, data: any): Promise<IRoutine> {
    console.log('[RoutineService] crearRutina llamada', data);
    try {
      const response = await axios.post(
        `${this.apiUrl}/${idNino}/rutinas`,
        data,
        { headers: this.getAuthHeader() }
      );
      console.log('AXIOS crearRutina response.data:', response.data);

      await this.getAllRoutines(idNino);

      const respData: any = response.data;
      if (respData && respData.data !== undefined) {
        return respData.data;
      }
      return respData;
    } catch (error) {
      console.error('[crearRutina] Error:', error);
      throw error;
    }
  }

  // Actualiza una rutina existente y recarga la lista
  async updateRoutine(idNino: number, idRutina: number, data: any): Promise<IRoutine> {
    console.log('[RoutineService] updateRoutine llamada', data);
    try {
      const response = await axios.put(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        data,
        { headers: this.getAuthHeader() }
      );
      console.log('AXIOS updateRoutine response.data:', response.data);

      await this.getAllRoutines(idNino);

      const respData: any = response.data;
      if (respData && respData.data !== undefined) {
        return respData.data;
      }
      return respData;
    } catch (error) {
      console.error('[updateRoutine] Error:', error);
      throw error;
    }
  }

  // Elimina una rutina y recarga la lista
  async deleteRoutine(idNino: number, idRutina: number): Promise<any> {
    console.log('[RoutineService] deleteRoutine llamada', idRutina);
    try {
      const response = await axios.delete(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        { headers: this.getAuthHeader() }
      );
      console.log('AXIOS deleteRoutine response.data:', response.data);

      await this.getAllRoutines(idNino);

      const respData: any = response.data;
      if (respData && respData.data !== undefined) {
        return respData.data;
      }
      return respData;
    } catch (error) {
      console.error('[deleteRoutine] Error:', error);
      throw error;
    }
  }
}
