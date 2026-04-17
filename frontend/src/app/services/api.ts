import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api';

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/books/`);
  }

  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/`, user);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/`, credentials);
  }

  getReadingEntries(): Observable<any> {
    return this.http.get(`${this.baseUrl}/entries/`);
  }

  createReadingEntry(entry: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/entries/`, entry);
  }

  updateReadingEntry(id: number, data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/entries/${id}/`, data);
  }

  deleteReadingEntry(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/entries/${id}/`);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.patch(`${this.baseUrl}/profile/`, data);
  }

  getMyCollections(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collections/`);
  }

  createCollection(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/collections/`, data);
  }

  addBookToCollection(collectionId: number, bookId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/collections/${collectionId}/books/${bookId}/`, {});
  }

  removeBookFromCollection(collectionId: number, bookId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/collections/${collectionId}/books/${bookId}/`);
  }

  getMyNotes(): Observable<any> {
    return this.http.get(`${this.baseUrl}/notes/`);
  }

  createNote(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/notes/`, data);
  }

  getMyReviews(): Observable<any> {
    return this.http.get(`${this.baseUrl}/reviews/`);
  }

  createReview(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/reviews/`, data);
  }

  getUserProfile(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/`);
  }

  getUserReviews(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/reviews/`);
  }

  getUserCollections(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${userId}/collections/`);
  }
}