import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); 
  private router = inject(Router);
  books: any[] = [];
  filteredBooks: any[] = [];

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.apiService.getBooks().subscribe({
      next: (data: any[]) => {
        this.books = data;
        this.filteredBooks = data;
        console.log('Книги получены:', data);
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Ошибка при получении книг:', err);
      }
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    
    
    this.filteredBooks = this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) || 
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  addToProgress(bookId: number) {
    const token = localStorage.getItem('access');
    this.router.navigate(['/login']);
    if (!token) {
      alert('Пожалуйста, войдите в систему!');
      return;
    }

    
    this.apiService.addToMyProgress(bookId).subscribe({
      next: (response: any) => {
        alert('Книга добавлена в ваш список прогресса!');
        console.log('Успех:', response);
        this.router.navigate(['/my-progress']);
      },
      error: (err: any) => {
        alert('Ошибка при добавлении книги. Возможно, она уже есть в списке.');
        console.error(err);
      }
    });
  }

  
}