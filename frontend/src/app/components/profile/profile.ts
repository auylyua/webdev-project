import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class Profile implements OnInit {
  username: string = 'User'; 
  bio: string = '';
  isEditingBio: boolean = false;

  notes: any[] = [];
  reviews: any[] = [];
  userBooks: any[] = [];

  isNoteModalOpen: boolean = false;
  isReviewModalOpen: boolean = false; 

  newNote = {
    book: '',
    page_number: '',
    text: '' 
  };

  newReview = {
    book: '',
    rating: 5,
    comment: ''
  };

  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadProfileData();
    this.loadUserNotes();
    this.loadUserBooks();
  }

  loadProfileData() {
    this.apiService.getUserProfile().subscribe({
      next: (data) => {
        this.username = data.username;
        this.bio = data.bio;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading profile:', err)
    });

    this.apiService.getUserReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.cdr.detectChanges();
      }
    });
  }

  loadUserNotes() {
    this.apiService.getUserNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading notes:', err)
    });
  }

  loadUserBooks() {
    this.apiService.getReadingEntries().subscribe({
      next: (data) => {
        this.userBooks = data;
        this.cdr.detectChanges();
      }
    });
  }

  toggleEdit() {
    this.isEditingBio = !this.isEditingBio;
  }

  saveBio() {
    this.apiService.updateUserProfile({ bio: this.bio }).subscribe({
      next: () => {
        this.isEditingBio = false;
        this.cdr.detectChanges();
      }
    });
  }

  // --- МЕТОДЫ ДЛЯ ЗАМЕТОК ---

  openNoteModal() {
    this.isNoteModalOpen = true;
  }

  closeNoteModal() {
    this.isNoteModalOpen = false;
    this.newNote = { book: '', page_number: '', text: '' };
  }

  saveNote() {
    const bookId = Number(this.newNote.book);
    const pageNum = Number(this.newNote.page_number) || 0;
    const noteText = this.newNote.text ? this.newNote.text.trim() : '';

    if (!bookId || !noteText) {
      alert('Choose a book and write a note!');
      return;
    }

    const payload = {
      book: bookId,
      page_number: pageNum,
      text: noteText
    };

    this.apiService.addNote(payload).subscribe({
      next: (res: any) => {
        this.notes.unshift(res);
        this.closeNoteModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error while saving note:', err.error);
      }
    });
  }

  deleteNote(id: number) {
    if (confirm('Are you sure you want to delete this note?')) {
      this.apiService.deleteNote(id).subscribe({
        next: () => {
          this.notes = this.notes.filter(n => n.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Delete error:', err)
      });
    }
  }

  // --- МЕТОДЫ ДЛЯ ОТЗЫВОВ ---

  openReviewModal() {
    this.isReviewModalOpen = true;
  }

  saveReview() {
    if (!this.newReview.book || !this.newReview.comment) {
      alert('Заполни все поля!');
      return;
    }

    const payload = {
      book: Number(this.newReview.book),
      rating: Number(this.newReview.rating),
      comment: this.newReview.comment 
    };

    this.apiService.addReview(payload).subscribe({
      next: (res: any) => {
        this.reviews.unshift(res);
        this.isReviewModalOpen = false;
        this.newReview = { book: '', rating: 5, comment: '' };
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Ошибка отзыва:', err.error);
        alert('Ошибка при сохранении отзыва');
      }
    });
  }
  deleteReview(id: number) {
  if (confirm('Are you sure you want to delete this review?')) {
    this.apiService.deleteReview(id).subscribe({
      next: () => {
        
        this.reviews = this.reviews.filter(r => r.id !== id);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error while deleting review:', err);
        alert('Failed to delete review.');
      }
    });
  }
}
}