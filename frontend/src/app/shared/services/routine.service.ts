import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IRoutine } from '../interfaces';
import { TokenService } from '../../features/auth/services';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly apiUrl = 'http://localhost:3000/api/ninos';
  private readonly tokenService = inject(TokenService);

  private rutinasSubject = new BehaviorSubject<IRoutine[]>([]);
  rutinas$ = this.rutinasSubject.asObservable();

  // Obtiene los headers de autorización
  private getAuthHeader() {
    const token = this.tokenService.getToken();
    if (!token) {
      console.warn('[RoutineService] No se encontró un token de autenticación');
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Maneja la respuesta de la API y lanza errores si es necesario
  private async handleResponse(response: Response) {
    let data: any;
    try {
      data = await response.json();
    } catch {
      data = {};
    }
    if (!response.ok) {
      const msg = data?.message || data?.error || 'Error en la petición';
      console.error('[RoutineService] API error:', msg);
      throw new Error(msg);
    }
    return data;
  }

  // Obtiene todas las rutinas de un niño
  async getAllRoutines(idNino: number): Promise<IRoutine[]> {
    console.log('[RoutineService] getAllRoutines llamada');
    try {
      const response = await fetch(
        `${this.apiUrl}/${idNino}/rutinas`,
        {
          method: 'GET',
          headers: this.getAuthHeader(),
        }
      );
      const data = await this.handleResponse(response);
      const rutinas = Array.isArray(data.data) ? data.data : [];
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
      const response = await fetch(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        {
          method: 'GET',
          headers: this.getAuthHeader(),
        }
      );
      const data = await this.handleResponse(response);
      return data.data !== undefined ? data.data : data;
    } catch (error) {
      console.error('[getRoutine] Error:', error);
      throw error;
    }
  }

  // Crea una nueva rutina
  async crearRutina(idNino: number, data: any): Promise<IRoutine> {
    console.log('[RoutineService] crearRutina llamada', data);
    try {
      const response = await fetch(
        `${this.apiUrl}/${idNino}/rutinas`,
        {
          method: 'POST',
          headers: this.getAuthHeader(),
          body: JSON.stringify(data),
        }
      );
      const result = await this.handleResponse(response);
      const nuevaRutina = result.data !== undefined ? result.data : result;
      const actuales = this.rutinasSubject.getValue();
      this.rutinasSubject.next([...actuales, nuevaRutina]);
      return nuevaRutina;
    } catch (error) {
      console.error('[crearRutina] Error:', error);
      throw error;
    }
  }

  // Actualiza una rutina existente
  async updateRoutine(idNino: number, idRutina: number, data: any): Promise<IRoutine> {
    console.log('[RoutineService] updateRoutine llamada', data);
    try {
      const response = await fetch(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        {
          method: 'PUT',
          headers: this.getAuthHeader(),
          body: JSON.stringify(data),
        }
      );
      const result = await this.handleResponse(response);
      const rutinaActualizada = result.data !== undefined ? result.data : result;
      const actuales = this.rutinasSubject.getValue();
      const nuevas = actuales.map(r => r.id === idRutina ? rutinaActualizada : r);
      this.rutinasSubject.next(nuevas);
      return rutinaActualizada;
    } catch (error) {
      console.error('[updateRoutine] Error:', error);
      throw error;
    }
  }

  // Elimina una rutina
  async deleteRoutine(idNino: number, idRutina: number): Promise<any> {
    console.log('[RoutineService] deleteRoutine llamada', idRutina);
    try {
      const response = await fetch(
        `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
        {
          method: 'DELETE',
          headers: this.getAuthHeader(),
        }
      );
      const result = await this.handleResponse(response);
      const actuales = this.rutinasSubject.getValue();
      this.rutinasSubject.next(actuales.filter(r => r.id !== idRutina));
      return result.data !== undefined ? result.data : result;
    } catch (error) {
      console.error('[deleteRoutine] Error:', error);
      throw error;
    }
  }
}
