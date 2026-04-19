import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef); 
  private router = inject(Router);

  books: any[] = [];

  isModalOpen = false;
  newBook = { title: '', author: '', total_pages: null as number | null, genre: '' };

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.apiService.getBooks().subscribe({
      next: (data: any[]) => {
        this.books = data;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Ошибка при получении книг:', err)
    });
  }

  
  addToProgress(bookId: number) {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Please log in to add books!');
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.addToMyProgress(bookId).subscribe({
      next: () => {
        alert('Book added to your progress!');
        this.router.navigate(['/my-progress']);
      },
      error: (err) => alert('Error: Maybe it is already in your list?')
    });
  }

  
  openAddBookModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newBook = { title: '', author: '', total_pages: null, genre: '' };
  }

  saveBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('Please fill at least Title and Author');
      return;
    }

    this.apiService.addBook(this.newBook).subscribe({
      next: (res) => {
        this.books.push(res); 
        this.closeModal();
        alert('Book successfully added to catalog!');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error adding book to catalog');
      }
    });
  }
}