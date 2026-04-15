import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private url = 'http://127.0.0.1:8001/api/books/';

  getBooks() {
    return this.http.get<Book[]>(this.url);
  }

  createBook(book: Book) {
    return this.http.post<Book>(this.url, book);
  }
}