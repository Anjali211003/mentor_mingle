import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Coach {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllCoaches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/coaches`);
  }

  getCoachById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/coaches/${id}`);
  }

  updateCoachProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/coach-profile`, data);
  }
}
