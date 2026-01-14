import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Session } from '../models/session.model';
import { Observable } from 'rxjs';
import { SessionRequest } from '../models/session-requests.model';

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
  approveSession(sessionId: number) {
  return this.http.post(
    `${this.apiUrl}/session-requests/${sessionId}/approve`,
    {}
  );
}
getAllSessions() {
  return this.http.get<Session[]>(`${this.apiUrl}/sessions`);
}

getMyRequestedSessions() {
  return this.http.get<Session[]>(`${this.apiUrl}/sessions/requests/my`);
}



requestSession(sessionId: number): Observable<Session> {
  return this.http.post<Session>(
    `/api/session-requests/${sessionId}`,
    {}
  );
}

// session.service.ts
getRequestedSessionsForCoach() {
  return this.http.get<SessionRequest[]>(
    '/api/session-requests/coach'
  );
}



rejectSession(sessionId: number) {
  return this.http.post(
    `${this.apiUrl}/session-requests/${sessionId}/reject`,
    {}
  );
}

}
