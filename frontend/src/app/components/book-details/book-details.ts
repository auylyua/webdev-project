import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  public authService = inject(AuthService);

  book: any = null;
  reviews: any[] = [];
  userEntries: any[] = [];
  currentEntry: any = null;

  isStatusMenuOpen = false;
  isRatingModalOpen = false;

  newReview = {
    rating: 5,
    comment: ''
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('book details opened');
    console.log('id =', this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadBook(id);
      this.loadBookReviews(id);
      if (this.authService.isLoggedIn()) {
        this.loadMyEntries(id);
      }
    }
  }

  loadBook(id: number) {
    this.apiService.getBookById(id).subscribe({
      next: (data) => {
        console.log('book loaded:', data);
        this.book = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading book:', err);
        this.router.navigate(['/catalog']);
      }
    });
  }

  loadBookReviews(bookId: number) {
    this.apiService.getBookReviews(bookId).subscribe({
      next: (data) => {
        console.log('reviews loaded:', data);
        this.reviews = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.reviews = [];
      }
    });
  }

  loadMyEntries(bookId: number) {
    this.apiService.getReadingEntries().subscribe({
      next: (data) => {
        this.userEntries = data;
        this.currentEntry = this.userEntries.find((entry: any) => entry.book === bookId) || null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading user entries:', err);
        this.userEntries = [];
        this.currentEntry = null;
      }
    });
  }

  getGenres(): string[] {
    if (!this.book?.genre) return [];
    return this.book.genre.split(',').map((g: string) => g.trim()).filter((g: string) => g);
  }

  getStatusLabel(status: string | null): string {
    if (!status) return 'Add to plans';
    if (status === 'planned') return 'Planned';
    if (status === 'reading') return 'Reading';
    if (status === 'finished') return 'Finished';
    if (status === 'dropped') return 'Dropped';
    return 'Add to plans';
  }

  getStatusClass(status: string | null): string {
    if (!status) return 'planned';
    return status;
  }

  handleStatusButton() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.currentEntry) {
      this.apiService.createReadingEntry({
        book: this.book.id,
        status: 'planned',
        current_page: 0
      }).subscribe({
        next: (res) => {
          this.currentEntry = res;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.isStatusMenuOpen = !this.isStatusMenuOpen;
  }

  changeStatus(status: string) {
    if (!this.currentEntry) return;

    this.apiService.updateReadingEntry(this.currentEntry.id, {
      status: status
    }).subscribe({
      next: (res) => {
        this.currentEntry = res;
        this.isStatusMenuOpen = false;
        this.cdr.detectChanges();
      }
    });
  }

  openRatingModal() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.isRatingModalOpen = true;
  }

  closeRatingModal() {
    this.isRatingModalOpen = false;
    this.newReview = {
      rating: 5,
      comment: ''
    };
  }

  setRating(value: number) {
    this.newReview.rating = value;
  }

  saveReview() {
    if (!this.book) return;

    this.apiService.addReview({
      book: this.book.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    }).subscribe({
      next: () => {
        this.closeRatingModal();
        this.loadBookReviews(this.book.id);
        this.loadBook(this.book.id);
      },
      error: () => {
        alert('You already reviewed this book or data is invalid.');
      }
    });
  }
}