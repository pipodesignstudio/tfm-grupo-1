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

  getActivitiesNino(nino_id: string): Promise<IActivity[]> {
    return lastValueFrom(
      this.httpClient.get<{ data: IActivity[] }>(`${this.apiUrl}/actividades/ninos/${nino_id}`)
    ).then(response => response.data);
  }

  deleteActivity(id: number, nino_id: number): Promise<IActivity> {
    return lastValueFrom(this.httpClient.delete<IActivity>(`${this.apiUrl}/actividades/ninos/${nino_id}/${id}`));
  }

  updateActivity(activity: IActivity): Promise<IActivity> {
    let { id, nino_id , ...activityBody } = activity;
    return lastValueFrom(this.httpClient.put<IActivity>(`${this.apiUrl}/actividades/ninos/${nino_id}/${id}`, activityBody));
  }

  createActivity(activity: IActivity): Promise<IActivity> {
    console.log("activity", activity);
    let { nino_id, ...activityBody } = activity;
    return lastValueFrom(this.httpClient.post<IActivity>(`${this.apiUrl}/actividades/ninos/${nino_id}`, activityBody));
  }
  
}