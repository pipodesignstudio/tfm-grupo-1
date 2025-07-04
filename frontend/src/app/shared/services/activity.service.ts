import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IActivity } from '../interfaces/iactivity.interface';
import { TokenService } from '../../features/auth/services';


interface CreateActivityResponse {
  success: boolean;
  message: string;
  data: IActivity;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private httpClient = inject(HttpClient)
  private apiUrl: string  = 'http://localhost:3000/api';

    private readonly tokenService = inject(TokenService);
  



  /**
   * Retrieves a list of activities associated with a specific family by its ID.
   *
   * @param id_familia - The unique identifier of the family whose activities are to be fetched.
   * @returns A promise that resolves to an array of `IActivity` objects.
   *
   * @throws Will propagate any HTTP or network errors encountered during the request.
   */
  getActivitiesFamily(id_familia: string): Promise<IActivity[]> {
  return lastValueFrom(
    this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/familias/${id_familia}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    })
  ).then(response => response.data);
}

  /**
   * Retrieves the list of activities associated with a specific child (niño) by their ID.
   *
   * @param nino_id - The unique identifier of the child whose activities are to be fetched.
   * @returns A promise that resolves to an array of `IActivity` objects for the specified child.
   *
   * @remarks
   * This method sends an HTTP GET request to the backend API endpoint `/actividades/ninos/{nino_id}`.
   * The request includes a Bearer token for authentication.
   */
  getActivitiesNino(nino_id: string): Promise<IActivity[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/ninos/${nino_id}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    })
    ).then(response => response.data);
  }

  /**
   * Deletes a specific activity associated with a child (niño) by its ID.
   *
   * @param id - The unique identifier of the activity to be deleted.
   * @param nino_id - The unique identifier of the child whose activity is to be deleted.
   * @returns A promise that resolves to the deleted `IActivity` object.
   *
   * @throws Will propagate any HTTP or network errors encountered during the request.
   */
  deleteActivity(id: number, nino_id: number): Promise<IActivity> {
    return lastValueFrom(this.httpClient.delete<IActivity>(`${this.apiUrl}/actividades/ninos/${nino_id}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    }));
  }

  /**
   * Updates an existing activity associated with a child (niño).
   *
   * @param activity - The activity object containing the updated details.
   * @returns A promise that resolves to the updated `IActivity` object.
   *
   * @remarks
   * The `activity` parameter should include the `id` and `ninos_id` properties, which are used to identify the activity and the child respectively.
   */
  updateActivity(activity: IActivity): Promise<IActivity> {
    let { id, ninos_id , ...activityBody } = activity;
    return lastValueFrom(this.httpClient.put<IActivity>(`${this.apiUrl}/actividades/ninos/${ninos_id}/${id}`, activityBody, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    }));
  }
  /**
   * Creates a new activity for a specific child (niño).
   *
   * @param activity - The activity object to be created, which should include the `ninos_id` property.
   * @returns A promise that resolves to the created `IActivity` object.
   *
   * @remarks
   * The `ninos_id` property is extracted from the `activity` object and used to associate the activity with the specific child.
   */
  createActivity(activity: IActivity): Promise<IActivity> {
    console.log("activity", activity);
    let { ninos_id, ...activityBody } = activity;
    return lastValueFrom(
    this.httpClient.post<CreateActivityResponse>(
      `${this.apiUrl}/actividades/ninos/${ninos_id}`,
      activityBody, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    })
  ).then(response => response.data);
  }
  
}