import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NinosapiService {
  private apiUrl = 'http://localhost:3000/api/ninos';

  constructor(private http: HttpClient) {}

  create(ninoData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.post(this.apiUrl, ninoData, { headers });
  }
}
