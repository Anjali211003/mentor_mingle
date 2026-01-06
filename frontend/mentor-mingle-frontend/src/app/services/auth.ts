import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ---------------- API CALLS ----------------

  login(credentials: any) {
  return this.http.post<any>(`${this.apiUrl}/login`, credentials)
    .pipe(
      tap((res) => {
        // 🔥 STORE TOKEN
        localStorage.setItem('token', res.access_token);

        // 🔥 STORE USER (THIS WAS MISSING)
        localStorage.setItem('users', JSON.stringify(res.user));
      })
    );
}


  register(data: {
    email: string;
    phone: string;
    password: string;
    name: string;
    role: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  // ---------------- TOKEN ----------------

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // ---------------- USER ----------------

  saveUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }
  getCurrentUser() {
  const stored =
    localStorage.getItem('users') ||
    localStorage.getItem('user') ||
    localStorage.getItem('currentUser');

  return stored ? JSON.parse(stored) : null;
}

  // ---------------- AUTH STATE ----------------

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
  }
}
