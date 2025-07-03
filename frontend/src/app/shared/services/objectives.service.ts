import { Injectable } from '@angular/core';
import axios from 'axios';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IObjective, IObjectiveCreateOrUpdate,} from '../interfaces/iobjective.interface';
import { TokenService } from '../../features/auth/services/token.service';

@Injectable({ providedIn: 'root' })
export class ObjectivesService {
  // URL base para acceder a los objetivos de un niño
  private readonly baseUrl = `${environment.backendUrl}/api/ninos`;

  // Almacena la lista de objetivos en memoria y expone un observable
  private objectivesSubject = new BehaviorSubject<IObjective[]>([]);
  public objectives$: Observable<IObjective[]> = this.objectivesSubject.asObservable();

  constructor(private tokenService: TokenService) {}

  /**
   * Devuelve las cabeceras con el token de autorización
   */
  private getAuthHeaders() {
    const token = this.tokenService.token();
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Obtiene todos los objetivos asociados a un niño por su ID
   * Actualiza el BehaviorSubject con la respuesta o con un array vacío si falla
   */
  public async getObjectivesByChildId(idNino: number): Promise<void> {
  try {
    const response = await axios.get<{ success: boolean; message: string; data: IObjective[] }>(
      `${this.baseUrl}/${idNino}/objetivos`,
      this.getAuthHeaders()
    );

    // ✅ Solo guardamos el array
    this.objectivesSubject.next(response.data.data);
  } catch (error) {
    console.error('Error al obtener los objetivos:', error);
    this.objectivesSubject.next([]);
  }
}

  /**
   * Crea un nuevo objetivo para el niño especificado
   * Añade el nuevo objetivo al array actual del BehaviorSubject
   */
  public async createObjective(idNino: number, body: IObjectiveCreateOrUpdate): Promise<void> {
    try {
      const response = await axios.post<{ data: IObjective }>(
        `${this.baseUrl}/${idNino}/objetivos`,
        body,
        this.getAuthHeaders()
      );
      const current = this.objectivesSubject.getValue();
      this.objectivesSubject.next([...current, response.data.data]);
    } catch (error) {
      console.error('Error al crear el objetivo:', error);
    }
  }

  /**
   * Actualiza un objetivo existente
   * Reemplaza el objetivo correspondiente en el BehaviorSubject
   */
  public async updateObjective(
    idNino: number,
    idObjetivo: number,
    body: IObjectiveCreateOrUpdate
  ): Promise<void> {
    try {
      const response = await axios.put<{ data: IObjective }>(
        `${this.baseUrl}/${idNino}/objetivos/${idObjetivo}`,
        body,
        this.getAuthHeaders()
      );
      const updated = response.data.data;
      const newList = this.objectivesSubject.getValue().map(obj =>
        obj.id === idObjetivo ? updated : obj
      );
      this.objectivesSubject.next(newList);
    } catch (error) {
      console.error('Error al actualizar el objetivo:', error);
    }
  }

  /**
   * Elimina un objetivo por su ID
   * Quita el objetivo del array del BehaviorSubject
   */
  public async deleteObjective(idNino: number, idObjetivo: number): Promise<void> {
    try {
      await axios.delete(`${this.baseUrl}/${idNino}/objetivos/${idObjetivo}`, this.getAuthHeaders());
      const newList = this.objectivesSubject.getValue().filter(obj => obj.id !== idObjetivo);
      this.objectivesSubject.next(newList);
    } catch (error) {
      console.error('Error al eliminar el objetivo:', error);
    }
  }

  /**
   * Devuelve la lista de objetivos actual almacenada en memoria
   */
  public getObjectives(): IObjective[] {
    const value = this.objectivesSubject.getValue();
    return value;
  }

  /**
   * Limpia los objetivos de la memoria (por ejemplo, al cambiar de niño)
   */
  public clearObjectives(): void {
    this.objectivesSubject.next([]);
  }
}