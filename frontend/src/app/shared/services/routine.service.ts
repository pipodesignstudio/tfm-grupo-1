import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRoutine } from '../interfaces';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutineService {
  private readonly API_URL = 'http://localhost:3000/api/ninos';

  constructor(private http: HttpClient) {}

  getAllRoutines(ninoId: number): Promise<IRoutine[]> {
    return firstValueFrom(
      this.http.get<IRoutine[]>(`${this.API_URL}/${ninoId}/rutinas`)
    );
  }

  getRoutineById(ninoId: number, rutinaId: number): Promise<IRoutine> {
    return firstValueFrom(
      this.http.get<IRoutine>(`${this.API_URL}/${ninoId}/rutinas/${rutinaId}`)
    );
  }

  createRoutine(ninoId: number, rutina: IRoutine): Promise<IRoutine> {
    return firstValueFrom(
      this.http.post<IRoutine>(`${this.API_URL}/${ninoId}/rutinas`, rutina)
    );
  }

  updateRoutine(ninoId: number, rutinaId: number, rutina: IRoutine): Promise<IRoutine> {
    return firstValueFrom(
      this.http.put<IRoutine>(`${this.API_URL}/${ninoId}/rutinas/${rutinaId}`, rutina)
    );
  }

  // ✅ Solución: usando HttpClient en lugar de axios
  deleteRoutine(ninoId: number, rutinaId: number): Promise<void> {
    return firstValueFrom(
      this.http.delete<void>(`${this.API_URL}/${ninoId}/rutinas/${rutinaId}`)
    );
  }
}
