import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../features/auth/services/token.service';
import { IObjetivo, ObjetivoDto } from '../interfaces/iobjective.interface';

interface ObjectiveResponse {
  data: {
    id: number;
    nombre: string;
    color: string;
    tipo: string;
    fecha_fin: string;
    actividades_ids: number[];
    // agrega otros campos si tu backend los devuelve
  };
}

@Injectable({ providedIn: 'root' })
export class ObjectivesService {
  private readonly baseUrl = `${environment.backendUrl}/api/ninos`;
  private tokenService = inject(TokenService);

  private objectivesSubject = new BehaviorSubject<IObjetivo[]>([]);
  public objectives$: Observable<IObjetivo[]> = this.objectivesSubject.asObservable();

  

  private getAuthHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    };
  }

  public async getAllObjectives(idNino: number): Promise<void> {
    try {
      const response = await axios.get<{ data: IObjetivo[] }>(
        `${this.baseUrl}/${idNino}/objetivos`,
        this.getAuthHeaders()
      );
      const objetivos = response.data.data;
      this.objectivesSubject.next(objetivos);
    } catch (error) {
      console.error('Error al obtener los objetivos:', error);
      this.objectivesSubject.next([]);
    }
  }

public async createObjective(data: ObjetivoDto, idNino: number): Promise<number | null> {
  try {
    const response = await axios.post<{ 
      data: { 
        data: { id: number } 
      } 
    }>(
      `${this.baseUrl}/${idNino}/objetivos`,
      data,
      this.getAuthHeaders()
    );
    await this.getAllObjectives(idNino);
    return response.data.data.data.id;
  } catch (error) {
    console.error(error);
    return null;
  }
}


  public async updateObjective(idNino: number, idObjetivo: number, data: Partial<IObjetivo>): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/${idNino}/objetivos/${idObjetivo}`,
        data,
        this.getAuthHeaders()
      );
      await this.getAllObjectives(idNino);
    } catch (error) {
      console.error('Error al actualizar el objetivo:', error);
      throw error;
    }
  }

  public async deleteObjective(idNino: number, idObjetivo: number): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/${idNino}/objetivos/${idObjetivo}`,
        this.getAuthHeaders()
      );
      await this.getAllObjectives(idNino);
    } catch (error) {
      console.error('Error al eliminar el objetivo:', error);
      throw error;
    }
  }

  public async addActivityToObjective(idObjetivo: number, idActividad: number): Promise<void> {
    await axios.post(
      `${this.baseUrl}/objetivos/${idObjetivo}/actividades`,
      { actividad_id: idActividad },
      this.getAuthHeaders()
    );
  }
}
