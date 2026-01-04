import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

 
getMyRequestedSessions() {
  return this.http.get<any[]>(
    `${this.apiUrl}/sessions/requests/my`
  );
}

  getMySessions() {
    return this.http.get<any[]>(`${this.apiUrl}/sessions/my`);
  }

  createSession(data: any) {
    return this.http.post(`${this.apiUrl}/sessions`, data);
  }

  deleteSession(id: number) {
    return this.http.delete(`${this.apiUrl}/sessions/${id}`);
  
  }
  approveSession(sessionId: number) {
  return this.http.post(
    `${this.apiUrl}/session-requests/${sessionId}/approve`,
    {}
  );
}

rejectSession(sessionId: number) {
  return this.http.post(
    `${this.apiUrl}/session-requests/${sessionId}/reject`,
    {}
  );
}

}
