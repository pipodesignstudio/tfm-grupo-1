import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { IRoutine } from '../interfaces';
import { TokenService } from '../../features/auth/services';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly apiUrl = 'http://localhost:3000/api/ninos';
  private readonly tokenService = inject(TokenService);

  private rutinasSubject = new BehaviorSubject<IRoutine[]>([]);
  rutinas$ = this.rutinasSubject.asObservable();

  private getAuthHeader() {
    const token = this.tokenService.getToken();
    if (!token) {
      console.warn('[RoutineService] No se encontró un token de autenticación');
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
  }

  private extractData(response: any) {
    return response?.data?.data !== undefined ? response.data.data : response.data;
  }

  async getAllRoutines(idNino: number): Promise<IRoutine[]> {
    try {
      const response = await axios.get<any>(
        `${this.apiUrl}/${idNino}/rutinas`,
        this.getAuthHeader()
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      const rutinas = Array.isArray(data) ? data : [];
      this.rutinasSubject.next(rutinas);
      return rutinas;
    } catch (error) {
      console.error('[getAllRoutines] Error:', error);
      throw error;
    }
  }

  async getRoutine(idNino: number, idRutina: number): Promise<IRoutine> {
    try {
      const response = await axios.get<any>(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        this.getAuthHeader()
      );
      return this.extractData(response);
    } catch (error) {
      console.error('[getRoutine] Error:', error);
      throw error;
    }
  }

  async crearRutina(idNino: number, data: any): Promise<IRoutine> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/${idNino}/rutinas`,
        data,
        this.getAuthHeader()
      );
      const nuevaRutina = this.extractData(response);

      const actuales = this.rutinasSubject.getValue();
      this.rutinasSubject.next([...actuales, nuevaRutina]);
      return nuevaRutina;
    } catch (error) {
      console.error('[crearRutina] Error:', error);
      throw error;
    }
  }

  async updateRoutine(idNino: number, idRutina: number, data: any): Promise<IRoutine> {
    try {
      const response = await axios.put(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        data,
        this.getAuthHeader()
      );
      const rutinaActualizada = this.extractData(response);

      const actuales = this.rutinasSubject.getValue();
      const nuevas = actuales.map(r => r.id === idRutina ? rutinaActualizada : r);
      this.rutinasSubject.next(nuevas);

      return rutinaActualizada;
    } catch (error) {
      console.error('[updateRoutine] Error:', error);
      throw error;
    }
  }

  async deleteRoutine(idNino: number, idRutina: number): Promise<any> {
    try {
      const response = await axios.delete(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        this.getAuthHeader()
      );

      const actuales = this.rutinasSubject.getValue();
      this.rutinasSubject.next(actuales.filter(r => r.id !== idRutina));
      return this.extractData(response);
    } catch (error) {
      console.error('[deleteRoutine] Error:', error);
      throw error;
    }
  }
}
