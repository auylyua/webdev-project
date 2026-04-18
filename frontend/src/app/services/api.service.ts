import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/`);
  }

  getReadingEntries(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/entries/`, { headers });
  }

  
addToMyProgress(bookId: number, token: string) {
  const headers =new HttpHeaders( { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
  
  // Отправляем ID книги на эндпоинт прогресса
  // Убедись, что URL совпадает с твоим (например, /api/my-progress/)
  return this.http.post(`${this.apiUrl}/my-progress/`, { book: bookId }, { headers });
}

  getLastActiveBook(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/home-stats/`, { headers });
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  
  updateProgress(token: string, entryId: number,  data: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.patch(`${this.apiUrl}/entries/${entryId}/`, data,  { headers });
}
  // src/app/services/api.service.ts

getUserNotes(token: string) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  // Убедись, что этот URL совпадает с твоим Django backend
  return this.http.get<any[]>(`${this.apiUrl}/profile/notes/`, { headers });
}

getUserReviews(token: string) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  // Убедись, что этот URL совпадает с твоим Django backend
  return this.http.get<any[]>(`${this.apiUrl}/profile/reviews/`, { headers });
}


}