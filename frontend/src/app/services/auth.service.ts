import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(res => {
        if (res.access) {
          localStorage.setItem('access', res.access);
          localStorage.setItem('username', res.username);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register/`, data);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  logout() {
    localStorage.clear();
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Guest';
  }
}