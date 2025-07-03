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
      console.log('RESPONSE DE LA API', response.data);
      const objetivos = response.data.data; // asegúrate que es un array
      this.objectivesSubject.next(objetivos); // ✅

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
}
