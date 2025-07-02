import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { TokenService } from '../../features/auth/services';

export interface IObjectiveActivity {
  id: number;
  titulo: string;
  descripcion?: string;
  completado: boolean;
  // ...otros campos si los necesitas
}

export interface IObjective {
  id: number;
  ninos_id: number;
  nombre: string;
  color: string;
  tipo: string;
  fecha_inicio: string; // Usa string para fechas si tu backend lo hace así
  fecha_fin: string;
  activities: IObjectiveActivity[];
  completado: boolean;
}

interface CreateObjectiveResponse {
  success: boolean;
  message: string;
  data: IObjective;
}

@Injectable({
  providedIn: 'root'
})
export class ObjectivesService {

  private httpClient = inject(HttpClient);
  private apiUrl: string  = 'http://localhost:3000/api';
  private readonly tokenService = inject(TokenService);

  // Obtener todos los objetivos de un niño
  getObjectivesByChild(ninos_id: string): Promise<IObjective[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: IObjective[] }>(
        `${this.apiUrl}/objetivos/ninos/${ninos_id}`,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      )
    ).then(response => response.data);
  }

  // Crear un objetivo para un niño
  createObjective(objective: Omit<IObjective, 'id'>): Promise<IObjective> {
    const { ninos_id, ...objectiveBody } = objective;
    return lastValueFrom(
      this.httpClient.post<CreateObjectiveResponse>(
        `${this.apiUrl}/objetivos/ninos/${ninos_id}`,
        objectiveBody,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      )
    ).then(response => response.data);
  }

  // Editar un objetivo
  updateObjective(objective: IObjective): Promise<IObjective> {
    const { id, ninos_id, ...objectiveBody } = objective;
    return lastValueFrom(
      this.httpClient.put<IObjective>(
        `${this.apiUrl}/objetivos/ninos/${ninos_id}/${id}`,
        objectiveBody,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      )
    );
  }

  // Eliminar un objetivo
  deleteObjective(id: number, ninos_id: number): Promise<IObjective> {
    return lastValueFrom(
      this.httpClient.delete<IObjective>(
        `${this.apiUrl}/objetivos/ninos/${ninos_id}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      )
    );
  }

  // Marcar/desmarcar actividad como completada
  toggleActivityCompletion(objectiveId: number, activityId: number, ninos_id: number): Promise<IObjective> {
    // Suponiendo que tienes un endpoint para esto. Si no, usa updateObjective.
    return lastValueFrom(
      this.httpClient.patch<IObjective>(
        `${this.apiUrl}/objetivos/ninos/${ninos_id}/${objectiveId}/activities/${activityId}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.tokenService.token()}`,
          },
        }
      )
    );
  }
}
