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
    const token = localStorage.getItem('access');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // --- МЕТОДЫ АВТОРИЗАЦИИ ---
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  // --- МЕТОДЫ КНИГ И ПРОГРЕССА ---
  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/`);
  }

  getReadingEntries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entries/`, { headers: this.getHeaders() });
  }

  addToMyProgress(bookId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/entries/`, 
      { book: bookId }, 
      { headers: this.getHeaders() } 
    );
  }

  updateReadingEntry(entryId: number, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/entries/${entryId}/`, data, { headers: this.getHeaders() });
  }

  // --- МЕТОДЫ ПРОФИЛЯ И ЗАМЕТОК ---
  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile/`, { headers: this.getHeaders() });
  }

  updateUserProfile(data: { bio: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile/`, data, { headers: this.getHeaders() });
  }

  getUserNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notes/`, { headers: this.getHeaders() });
  }

  addNote(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/notes/`, data, { headers: this.getHeaders() });
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notes/${id}/`, { headers: this.getHeaders() });
  }

  getUserReviews(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reviews/`, { headers: this.getHeaders() });
  }

  getLastActiveBook(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/home-stats/`, { headers: this.getHeaders() });
  }

  
  addReview(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/`, data, { headers: this.getHeaders() });
  }

  deleteReadingEntry(id: number): Observable<any> {
  
  return this.http.delete(`${this.apiUrl}/entries/${id}/`, { headers: this.getHeaders() });
}

deleteReview(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/reviews/${id}/`, { headers: this.getHeaders() });
}
}