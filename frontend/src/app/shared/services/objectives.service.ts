import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import axios from 'axios';
import { ObjetivoDto } from '../interfaces';
import { TokenService } from '../../features/auth/services';

@Injectable({ providedIn: 'root' })
export class ObjectivesService {

  private baseUrl = environment.backendUrl;


  private objectivesSubject = new BehaviorSubject<Objective[]>([]);
  public objectives$: Observable<Objective[]> = this.objectivesSubject.asObservable();
  private tokenService = inject(TokenService)

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

  getObjectiveProgress(objective: Objective): number {
    if (objective.activities.length === 0) return 0;
    const completedActivities = objective.activities.filter(act => act.completado).length;
    return Math.round((completedActivities / objective.activities.length) * 100);
  }

  private saveObjectivesToLocalStorage(objectives: Objective[]): void {
    localStorage.setItem('objectives', JSON.stringify(objectives));
  }

  // API 

  public async createObjective(dto: ObjetivoDto, idNino: number): Promise<number | null> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/ninos/${idNino}/objetivos`, dto, {
        headers: {
          'Authorization': `Bearer ${this.tokenService.token()}`
        }
      });
      return response.data.data.data.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  }



}
