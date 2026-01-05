import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Profile {

  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // COACH


  getCoachProfile(): Observable<any> {
    return this.http.get<any>(`${this.api}/coach-profile`);
  }

  // Create OR Update coach profile (PUT only)
  updateCoachProfile(data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/coach-profile`, data);
  }
   
  createCoachProfile(data: any): Observable<any> {
    return this.http.post(`${this.api}/coach-profile`, data);
  }
  // Delete coach profile
  deleteCoachProfile(): Observable<any> {
    return this.http.delete<any>(`${this.api}/coach-profile`);
  }



  // COACHEE
  getCoacheeProfile(): Observable<any> {
    return this.http.get(`${this.api}/coachee-profile`);
  }

  createCoacheeProfile(data: any): Observable<any> {
    return this.http.post(`${this.api}/coachee-profile`, data);
  }

  updateCoacheeProfile(data: any): Observable<any> {
    return this.http.put(`${this.api}/coachee-profile`, data);
  }
}
