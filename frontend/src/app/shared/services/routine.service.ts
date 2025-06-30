import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRoutine } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private baseUrl = '/api/ninos';

  constructor(private http: HttpClient) {}

  // ✔ Obtener todas las rutinas de un niño
  getAllRoutines(idNino: number): Observable<IRoutine[]> {
    return this.http.get<IRoutine[]>(`${this.baseUrl}/${idNino}/rutinas`);
  }

  // ✔ Obtener una rutina específica de un niño
  getRoutine(idNino: number, idRutina: number): Observable<{ data: IRoutine }> {
    return this.http.get<{ data: IRoutine }>(`${this.baseUrl}/${idNino}/rutinas/${idRutina}`);
  }

  // ✔ Actualizar una rutina
  updateRoutine(idNino: number, idRutina: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idNino}/rutinas/${idRutina}`, data);
  }

  // ✔ Eliminar una rutina
  deleteRoutine(idNino: number, idRutina: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idNino}/rutinas/${idRutina}`);
  }

  // ✔ Crear una rutina
  crearRutina(idNino: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${idNino}/rutinas`, data);
  }
}
