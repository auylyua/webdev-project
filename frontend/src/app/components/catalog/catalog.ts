import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private apiService = inject(ApiService);
  books: any[] = [];

  ngOnInit() {
    this.apiService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        console.log('Книги получены:', data);
      },
      error: (err) => {
        console.error('Ошибка при получении книг:', err);
      }
    });
  }
}