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
  



  getActivitiesFamily(id_familia: string): Promise<IActivity[]> {
  return lastValueFrom(
    this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/familias/${id_familia}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    })
  ).then(response => response.data);
}

  getActivitiesNino(nino_id: string): Promise<IActivity[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/ninos/${nino_id}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    })
    ).then(response => response.data);
  }

  deleteActivity(id: number, nino_id: number): Promise<IActivity> {
    return lastValueFrom(this.httpClient.delete<IActivity>(`${this.apiUrl}/actividades/ninos/${nino_id}/${id}`, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    }));
  }

  updateActivity(activity: IActivity): Promise<IActivity> {
    let { id, ninos_id , ...activityBody } = activity;
    return lastValueFrom(this.httpClient.put<IActivity>(`${this.apiUrl}/actividades/ninos/${ninos_id}/${id}`, activityBody, {
      headers: {
        Authorization: `Bearer ${this.tokenService.token()}`,
      },
    }));
  }

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

  getActivityById(id: number): Promise<IActivity> {
    return lastValueFrom(
      this.httpClient.get<{ data: IActivity }>(`${this.apiUrl}/actividades/${id}`, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      })
    ).then(response => response.data);
  }
  
  
}