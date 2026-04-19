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
    
    if (!token) {
      alert('Please log in to add books to your progress!');
      this.router.navigate(['/login']);
      return;
    }

    
    this.apiService.addToMyProgress(bookId).subscribe({
      next: (response: any) => {
        alert('Book added to your progress list!');
        console.log('Success:', response);
        this.router.navigate(['/my-progress']);
      },
      error: (err: any) => {
        if(err.status === 401) {
          alert('Session expired. Please log in again.');
          this.router.navigate(['/login']);
        } else {
          alert('Error adding book. It might already be in your list.');
          console.error(err);
        }
      }
    });
  }

  
}