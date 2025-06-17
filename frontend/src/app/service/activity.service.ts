import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IActivity } from '../interfaces/iactivity.interface';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private httpClient = inject(HttpClient)
  private apiUrl: string  = 'http://localhost:3000/api';



  getActivitiesFamily(id_familia: string): Promise<IActivity[]> {
  return lastValueFrom(
    this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/familias/${id_familia}`)
  ).then(response => response.data);
}

  getActivitiesNino(id_nino: string): Promise<IActivity[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/ninos/${id_nino}`)
    ).then(response => response.data);
  }

  deleteActivity(id: string, id_nino: string): Promise<IActivity> {
    return lastValueFrom(this.httpClient.delete<IActivity>(`${this.apiUrl}/actividades/ninos/${id_nino}/${id}`));
  }

  updateActivity(activity: IActivity): Promise<IActivity> {
    let { id, id_nino , ...activityBody } = activity;
    return lastValueFrom(this.httpClient.put<IActivity>(`${this.apiUrl}/actividades/ninos/${id_nino}/${id}`, activityBody));
  }

  createActivity(activity: IActivity): Promise<IActivity> {
    let { id_nino, ...activityBody } = activity;
    return lastValueFrom(this.httpClient.post<IActivity>(`${this.apiUrl}/actividades/ninos/${id_nino}`, activityBody));
  }
  
}