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
    // Используем !! чтобы всегда возвращать true/false (избегаем типа unknown)
    return !!localStorage.getItem('access');
  }

  logout() {
    localStorage.clear();
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'Guest';
  }
}