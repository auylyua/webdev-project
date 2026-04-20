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

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login/`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  getBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/`);
  }
  
  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/books/${id}/`);
  }

  getBookReviews(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/books/${bookId}/reviews/`);
  }

  addBook(bookData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/books/`, bookData, { headers: this.getHeaders() });
  }

  getReadingEntries(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/entries/`, { headers: this.getHeaders() });
  }

  createReadingEntry(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/entries/`, data, { headers: this.getHeaders() });
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

  deleteReadingEntry(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/entries/${id}/`, { headers: this.getHeaders() });
  }

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

  addReview(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reviews/`, data, { headers: this.getHeaders() });
  }

  deleteReview(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reviews/${id}/`, { headers: this.getHeaders() });
  }

  getLastActiveBook(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/home-stats/`, { headers: this.getHeaders() });
  }

  getPublicUserProfile(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}/`);
  }

  getPublicUserReviews(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/reviews/`);
  }

  getPublicUserEntries(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/entries/`);
  }

  getUserCollections(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/collections/`);
  }

  getMyCollections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/collections/`, { headers: this.getHeaders() });
  }

  createCollection(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/collections/`, data, { headers: this.getHeaders() });
  }

  addBookToCollection(collectionId: number, bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/collections/${collectionId}/books/${bookId}/`, {}, { headers: this.getHeaders() });
  }

  removeBookFromCollection(collectionId: number, bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/collections/${collectionId}/books/${bookId}/`, { headers: this.getHeaders() });
  }
  getTopBooks(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/books/top/`);
}

getCurrentlyReadingBooks(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/books/currently-reading/`);
}

upsertReview(data: any) {
  return this.http.post(`${this.apiUrl}/reviews/upsert/`, data, { headers: this.getHeaders() });
}

deleteCollection(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/collections/${id}/`, { headers: this.getHeaders() });
}

getBooksFiltered(params?: {
  sort?: string;
  genre?: string;
  search?: string;
  year?: string | number;
}): Observable<any[]> {
  const query = new URLSearchParams();

  if (params?.sort) query.set('sort', params.sort);
  if (params?.genre) query.set('genre', params.genre);
  if (params?.search) query.set('search', params.search);
  if (params?.year) query.set('year', String(params.year));

  const queryString = query.toString();
  const url = queryString
    ? `${this.apiUrl}/books/?${queryString}`
    : `${this.apiUrl}/books/`;

  return this.http.get<any[]>(url);
}
}