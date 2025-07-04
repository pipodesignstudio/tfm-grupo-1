import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ActivityDto, IActivity } from '../interfaces/iactivity.interface';
import { TokenService } from '../../features/auth/services';
import axios from 'axios';


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

  async createActivity(activity: IActivity): Promise<IActivity> {
    console.log("activity", activity);
    let { ninos_id, ...activityBody } = activity;
    const response = await lastValueFrom(
      this.httpClient.post<CreateActivityResponse>(
        `${this.apiUrl}/actividades/ninos/${ninos_id}`,
        activityBody, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      })
    );
    return response.data;
  }

  async buildActivitiesSuggestions():Promise<{titulo:string,descripcion:string, color:string}[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/suggestions`, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async postMinimalActivity(activity: ActivityDto, nino_id: number): Promise<IActivity | null> {
    try {
      const response = await axios.post(`${this.apiUrl}/actividades/ninos/${nino_id}`, activity, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });
      return response.data ;
    } catch (error) {
      console.error(error);
      return null;
    }

  }

  async getMyActivities(): Promise<IActivity[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/actividades/my-activities`, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async downloadActivities(ids: number[]): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/actividades/export`, { activityIds: ids }, {
        headers: {
          Authorization: `Bearer ${this.tokenService.token()}`,
        },
        responseType: 'blob', 
      });
  
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', 'actividades.pdf'); 
      document.body.appendChild(link); 
      link.click(); 
  
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
  
    } catch (error) {
      console.error('Error downloading PDF:', error);
      return false;
    }
    return true;
  }

}


