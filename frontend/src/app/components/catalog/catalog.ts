import { Component, OnInit, inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  books: any[] = [];
  topBooks: any[] = [];
  currentlyReading: any[] = [];

  searchTerm = '';
  selectedGenre = '';
  selectedSort = '';

  isModalOpen = false;
  newBook = {
    title: '',
    author: '',
    total_pages: null as number | null,
    genre: '',
    description: '',
    published_year: null as number | null,
    cover_image: '',
    read_link: ''
  };

  ngOnInit() {
    this.loadBooks();
  }

  loadBooks() {
    this.apiService.getBooksFiltered({
      search: this.searchTerm,
      genre: this.selectedGenre,
      sort: this.selectedSort
    }).subscribe({
      next: (data: any[]) => {
        this.books = data;
        this.currentlyReading = data.slice(0, 6);
        this.topBooks = [...data]
          .sort((a, b) => {
            const ratingA = a.average_rating || 0;
            const ratingB = b.average_rating || 0;
            return ratingB - ratingA;
          })
          .slice(0, 10);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading books:', err)
    });
  }

  applyFilters() {
    this.loadBooks();
  }

  openBook(id: number) {
    this.router.navigate(['/books', id]);
  }

  getGenres(genre: string): string[] {
    if (!genre) return [];
    return genre.split(',').map(g => g.trim()).filter(g => g);
  }

  addToProgress(bookId: number, event?: Event) {
    event?.stopPropagation();

    const token = localStorage.getItem('access');
    if (!token) {
      alert('Please log in to add books!');
      this.router.navigate(['/login']);
      return;
    }

    this.apiService.addToMyProgress(bookId).subscribe({
      next: () => {
        alert('Book added to your progress!');
      },
      error: () => {
        alert('Maybe this book is already in your list.');
      }
    });
  }

  openAddBookModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.newBook = {
      title: '',
      author: '',
      total_pages: null,
      genre: '',
      description: '',
      published_year: null,
      cover_image: '',
      read_link: ''
    };
  }

  saveBook() {
    if (!this.newBook.title || !this.newBook.author) {
      alert('Please fill at least Title and Author');
      return;
    }

    this.apiService.addBook(this.newBook).subscribe({
      next: (res) => {
        this.books.unshift(res);
        this.closeModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        alert('Error adding book');
      }
    });
  }

  scrollLeft() {
    this.scrollContainer?.nativeElement.scrollBy({
      left: -500,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer?.nativeElement.scrollBy({
      left: 500,
      behavior: 'smooth'
    });
  }
}