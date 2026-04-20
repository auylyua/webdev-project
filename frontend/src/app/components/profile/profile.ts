import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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
  collections: any[] = [];
  allBooks: any[] = [];
  filteredBooks: any[] = [];

  isNoteModalOpen = false;
  isReviewModalOpen = false;
  isCollectionModalOpen = false;
  isCollectionPreviewOpen = false;

  selectedCollection: any = null;
  bookSearch = '';

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

  newCollection = {
    title: '',
    description: '',
    is_public: true
  };

  selectedBooks: any[] = [];

  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit() {
    this.loadProfileData();
    this.loadUserNotes();
    this.loadUserBooks();
    this.loadMyCollections();
    this.loadAllBooks();
  }

  loadProfileData() {
    this.apiService.getUserProfile().subscribe({
      next: (data) => {
        this.username = data.username;
        this.bio = data.bio || '';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading profile:', err)
    });

    this.apiService.getUserReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading reviews:', err)
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
      },
      error: (err) => console.error('Error loading user books:', err)
    });
  }

  loadMyCollections() {
    this.apiService.getMyCollections().subscribe({
      next: (data) => {
        this.collections = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading collections:', err)
    });
  }

  loadAllBooks() {
    this.apiService.getBooksFiltered().subscribe({
      next: (data) => {
        this.allBooks = data;
        this.filteredBooks = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading all books:', err)
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
      },
      error: (err) => console.error('Error saving bio:', err)
    });
  }

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

  openReviewModal() {
    this.isReviewModalOpen = true;
  }

  saveReview() {
    if (!this.newReview.book || !this.newReview.comment) {
      alert('Fill all fields!');
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
        console.error('Review error:', err.error);
        alert('Error while saving review');
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

  getReadingNow() {
    return this.userBooks.filter(book => book.status === 'reading');
  }

  getFinishedBooks() {
    return this.userBooks.filter(book => book.status === 'finished');
  }

  openCollectionModal() {
    this.isCollectionModalOpen = true;
    this.newCollection = {
      title: '',
      description: '',
      is_public: true
    };
    this.selectedBooks = [];
    this.bookSearch = '';
    this.filteredBooks = this.allBooks;
  }

  closeCollectionModal() {
    this.isCollectionModalOpen = false;
  }

  searchBooks() {
    const q = this.bookSearch.toLowerCase();
    this.filteredBooks = this.allBooks.filter(b =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  toggleBook(book: any) {
    const idx = this.selectedBooks.findIndex(b => b.id === book.id);
    if (idx === -1) {
      this.selectedBooks.push(book);
    } else {
      this.selectedBooks.splice(idx, 1);
    }
  }

  isSelected(book: any): boolean {
    return this.selectedBooks.some(b => b.id === book.id);
  }

  saveCollection() {
    if (!this.newCollection.title.trim()) {
      alert('Enter a title!');
      return;
    }

    this.apiService.createCollection({
      title: this.newCollection.title,
      description: this.newCollection.description,
      is_public: this.newCollection.is_public
    }).subscribe({
      next: (col: any) => {
        const bookRequests = this.selectedBooks.map(b =>
          this.apiService.addBookToCollection(col.id, b.id)
        );

        if (bookRequests.length === 0) {
          this.collections.unshift(col);
          this.closeCollectionModal();
          this.cdr.detectChanges();
          return;
        }

        let done = 0;
        bookRequests.forEach(req => req.subscribe({
          next: () => {
            done++;
            if (done === bookRequests.length) {
              this.loadMyCollections();
              this.closeCollectionModal();
              this.cdr.detectChanges();
            }
          }
        }));
      },
      error: () => alert('Error creating collection.')
    });
  }

  deleteCollection(id: number) {
    if (confirm('Delete this collection?')) {
      this.apiService.deleteCollection(id).subscribe({
        next: () => {
          this.collections = this.collections.filter(c => c.id !== id);
          this.cdr.detectChanges();
        }
      });
    }
  }

  getCoverImages(col: any): string[] {
    if (!col.books || col.books.length === 0) return [];
    return col.books.slice(0, 4).map((b: any) => b.cover_image).filter((img: string) => img);
  }

  openCollectionPreview(col: any) {
    this.selectedCollection = col;
    this.isCollectionPreviewOpen = true;
  }

  closeCollectionPreview() {
    this.isCollectionPreviewOpen = false;
    this.selectedCollection = null;
  }

  openBook(id: number, event?: Event) {
    event?.stopPropagation();
    this.router.navigate(['/books', id]);
  }
}