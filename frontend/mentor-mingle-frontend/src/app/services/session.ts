import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 


  getMySessions() {
    return this.http.get<any[]>(`${this.apiUrl}/sessions/my`);
  }

  createSession(data: any) {
    return this.http.post(`${this.apiUrl}/sessions`, data);
  }

  deleteSession(id: number) {
    return this.http.delete(`${this.apiUrl}/sessions/${id}`);
  
  }
}
