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
    return lastValueFrom(this.httpClient.get<IActivity[]>(`${this.apiUrl}/familias/${id_familia}/actividades`));
  }

  getActivitiesNino(id_nino: string): Promise<IActivity[]> {
    return lastValueFrom(this.httpClient.get<IActivity[]>(`${this.apiUrl}/ninos/${id_nino}/actividades`));
  }

  deleteActivity(id: string, id_nino: string): Promise<IActivity> {
    return lastValueFrom(this.httpClient.delete<IActivity>(`${this.apiUrl}/ninos/${id_nino}/actividades/${id}`));
  }

  updateActivity(activity: IActivity): Promise<IActivity> {
    let { id, id_nino , ...activityBody } = activity;
    return lastValueFrom(this.httpClient.put<IActivity>(`${this.apiUrl}/ninos/${id_nino}/actividades/${id}`, activityBody));
  }

  createActivity(activity: IActivity): Promise<IActivity> {
    let { id_nino, ...activityBody } = activity;
    return lastValueFrom(this.httpClient.post<IActivity>(`${this.apiUrl}/ninos/${id_nino}/actividades`, activityBody));
  }
  
}