import { inject, Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { TokenService } from '../../features/auth/services/token.service';

@Injectable({ providedIn: 'root' })
export class ObjetivosHasActivitiesService {
  private readonly baseUrl = `${environment.backendUrl}/api/objetivos`;
  private tokenService = inject(TokenService);

  /**
 * Devuelve las cabeceras de autorización Bearer.
 *
 * @returns Un objeto con la cabecera Authorization.
 */
private getAuthHeaders() {
  return {
    headers: { Authorization: `Bearer ${this.tokenService.token()}` },
  };
}

/**
 * Crea la relación **objetivo ⇄ actividad**.
 *
 * @param params - Objeto con los IDs del objetivo y la actividad.
 * @returns Promesa que resuelve con los datos devueltos por la API.
 *
 * @example
 * await addActivityToObjective({ objetivoId: 23, actividadId: 55 });
 */
async addActivityToObjective(
  params: { objetivoId: number; actividadId: number }
): Promise<any> {
  const { objetivoId, actividadId } = params;

  const response = await axios.post<{ data: any }>(
    `${this.baseUrl}/${objetivoId}/actividades/${actividadId}`,
    null,                       
    this.getAuthHeaders()
  );

  return response.data;
}

/**
 * Elimina la relación **objetivo ⇄ actividad**.
 *
 * @param params - Objeto con los IDs del objetivo y la actividad.
 * @returns Promesa que se resuelve cuando la operación finaliza.
 *
 * @example
 * await removeActivityFromObjective({ objetivoId: 23, actividadId: 55 });
 */
async removeActivityFromObjective(
  params: { objetivoId: number; actividadId: number }
): Promise<void> {
  const { objetivoId, actividadId } = params;

  await axios.delete(
    `${this.baseUrl}/${objetivoId}/actividades/${actividadId}`,
    this.getAuthHeaders()
  );
}

    
}