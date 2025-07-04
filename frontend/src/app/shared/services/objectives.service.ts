import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../features/auth/services/token.service';
import { IObjetivo } from '../interfaces/iobjective.interface';

@Injectable({ providedIn: 'root' })
export class ObjectivesService {
  private readonly baseUrl = `${environment.backendUrl}/api/ninos`;

  private objectivesSubject = new BehaviorSubject<IObjetivo[]>([]);
  public objectives$: Observable<IObjetivo[]> = this.objectivesSubject.asObservable();

  constructor(private tokenService: TokenService) {}

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

  public getObjectives(): IObjetivo[] {
    return this.objectivesSubject.getValue();
  }

  public clearObjectives(): void {
    this.objectivesSubject.next([]);
  }

  public async createObjective(idNino: number, data: Partial<IObjetivo>): Promise<void> {
    try {
      await axios.post(
        `${this.baseUrl}/${idNino}/objetivos`,
        data,
        this.getAuthHeaders()
      );
      await this.getAllObjectives(idNino); // refrescar lista
    } catch (error) {
      console.error('Error al crear el objetivo:', error);
      throw error;
    }
  }

  public async updateObjective(idNino: number, idObjetivo: number, data: Partial<IObjetivo>): Promise<void> {
    try {
      await axios.put(
        `${this.baseUrl}/${idNino}/objetivos/${idObjetivo}`,
        data,
        this.getAuthHeaders()
      );
      await this.getAllObjectives(idNino); // refrescar lista
    } catch (error) {
      console.error('Error al actualizar el objetivo:', error);
      throw error;
    }
  }

  // NUEVO: Eliminar objetivo
  public async deleteObjective(idNino: number, idObjetivo: number): Promise<void> {
    try {
      await axios.delete(
        `${this.baseUrl}/${idNino}/objetivos/${idObjetivo}`,
        this.getAuthHeaders()
      );
      await this.getAllObjectives(idNino); // refrescar lista
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
