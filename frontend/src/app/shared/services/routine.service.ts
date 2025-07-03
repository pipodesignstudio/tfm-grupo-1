import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject } from 'rxjs';
import { IRoutine } from '../interfaces';
import { TokenService } from '../../features/auth/services';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly apiUrl = 'http://localhost:3000/api/ninos';
  private readonly tokenService = inject(TokenService);

  // Estado reactivo de rutinas
  private rutinasSubject = new BehaviorSubject<IRoutine[]>([]);
  rutinas$ = this.rutinasSubject.asObservable();

  /**
   * Devuelve los headers con el token JWT para autenticación.
   */
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

  /**
   * Extrae el dato útil de la respuesta, sea response.data o response.data.data
   */
  private extractData(response: any) {
    return response?.data?.data !== undefined ? response.data.data : response.data;
  }

  /**
   * Obtiene todas las rutinas de un niño y actualiza el estado compartido.
   */
  async getAllRoutines(idNino: number): Promise<IRoutine[]> {
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
  }

  /**
   * Obtiene una rutina específica.
   */
  async getRoutine(idNino: number, idRutina: number): Promise<IRoutine> {
    const response = await axios.get<any>(
      `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
      this.getAuthHeader()
    );
    return this.extractData(response);
  }

  /**
   * Crea una nueva rutina y actualiza el estado compartido.
   */
  async crearRutina(idNino: number, data: any): Promise<IRoutine> {
    const response = await axios.post(
      `${this.apiUrl}/${idNino}/rutinas`,
      data,
      this.getAuthHeader()
    );
    const nuevaRutina = this.extractData(response);

    const actuales = this.rutinasSubject.getValue();
    this.rutinasSubject.next([...actuales, nuevaRutina]);
    return nuevaRutina;
  }

  /**
   * Actualiza una rutina existente y actualiza el estado compartido.
   */
  async updateRoutine(idNino: number, idRutina: number, data: any): Promise<IRoutine> {
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
  }

  /**
   * Elimina una rutina y actualiza el estado compartido.
   */
  async deleteRoutine(idNino: number, idRutina: number): Promise<any> {
    const response = await axios.delete(
      `${this.apiUrl}/${idNino}/rutinas/${idRutina}`,
      this.getAuthHeader()
    );

    const actuales = this.rutinasSubject.getValue();
    this.rutinasSubject.next(actuales.filter(r => r.id !== idRutina));
    return this.extractData(response);
  }
}
