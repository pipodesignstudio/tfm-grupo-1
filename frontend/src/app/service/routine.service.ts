import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRoutine } from '../interfaces/iroutine.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoutineService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api';

  getAllRoutines(): Promise<IRoutine[]> {
    return lastValueFrom(
      this.http.get<{ data: IRoutine[] }>(`${this.apiUrl}/rutinas`)
    ).then(res => res.data);
  }

  getRoutineById(id: number): Promise<IRoutine> {
    return lastValueFrom(
      this.http.get<{ data: IRoutine }>(`${this.apiUrl}/rutinas/${id}`)
    ).then(res => res.data);
  }

  createRoutine(routine: IRoutine): Promise<IRoutine> {
    return lastValueFrom(
      this.http.post<{ data: IRoutine }>(`${this.apiUrl}/rutinas`, routine)
    ).then(res => res.data);
  }

  updateRoutine(id: number, routine: IRoutine): Promise<IRoutine> {
    return lastValueFrom(
      this.http.put<{ data: IRoutine }>(`${this.apiUrl}/rutinas/${id}`, routine)
    ).then(res => res.data);
  }

  deleteRoutine(id: number): Promise<void> {
    return lastValueFrom(this.http.delete<void>(`${this.apiUrl}/rutinas/${id}`));
  }
}
