
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CoacheeSession {

   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMyRequestedSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sessions/requests/my`);
  }
}
