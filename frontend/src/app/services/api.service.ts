import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/`);
  }

  
  getReadingEntries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entries/`, { headers: this.getHeaders() });
  }

  addToMyProgress(bookId: number) {
    return this.http.post(`${this.apiUrl}/my-progress/`, { book: bookId }, { headers: this.getHeaders() });
  }

  getLastActiveBook(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/home-stats/`, { headers: this.getHeaders() });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  
  updateReadingEntry(entryId: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/entries/${entryId}/`, data, { headers: this.getHeaders() });
  }

  getUserNotes() {
    return this.http.get<any[]>(`${this.apiUrl}/profile/notes/`, { headers: this.getHeaders() });
  }

  getUserReviews() {
    return this.http.get<any[]>(`${this.apiUrl}/profile/reviews/`, { headers: this.getHeaders() });
  }
}