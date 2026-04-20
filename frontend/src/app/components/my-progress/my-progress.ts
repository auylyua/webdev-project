import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-progress',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-progress.html',
  styleUrl: './my-progress.css'
})
export class MyProgress implements OnInit {
  entries: any[] = [];
  isModalOpen = false;
  selectedEntry: any = null;
  editData: any = {};

  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadEntries();
  }

  loadEntries() {
    this.apiService.getReadingEntries().subscribe({
      next: (data: any) => {
        this.entries = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Ошибка загрузки прогресса:', err)
    });
  }

  openEditModal(entry: any) {
    this.selectedEntry = entry;
    this.editData = {
      ...entry,
      comment: entry.comment || ''
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEntry = null;
    this.editData = {};
  }

  onStatusChange() {
    const totalPages = this.selectedEntry?.total_pages || 0;

    if (this.editData.status === 'finished') {
      this.editData.current_page = totalPages;
    }

    if (this.editData.status === 'planned') {
      this.editData.current_page = 0;
    }

    this.cdr.detectChanges();
  }

  onPageChange() {
    const totalPages = this.selectedEntry?.total_pages || 0;
    this.editData.current_page = Number(this.editData.current_page);

    if (this.editData.current_page === 0) {
      this.editData.status = 'planned';
    } else if (this.editData.current_page >= totalPages && totalPages > 0) {
      this.editData.status = 'finished';
      this.editData.current_page = totalPages;
    } else if (this.editData.current_page > 0) {
      this.editData.status = 'reading';
    }
  }

  setEditRating(star: number) {
    this.editData.rating = star;
    if (!this.editData.comment) {
      this.editData.comment = '';
    }
  }

  saveChanges() {
    this.apiService.updateReadingEntry(this.editData.id, this.editData).subscribe({
      next: () => {
        if (this.editData.rating > 0) {
          this.apiService.upsertReview({
            book: this.editData.book,
            rating: this.editData.rating,
            comment: this.editData.comment || ''
          }).subscribe();
        }

        this.closeModal();
        this.loadEntries();
      },
      error: (err: any) => console.error('Error while saving:', err)
    });
  }

  deleteEntry(id: number) {
    if (confirm('Are you sure you want to remove this book from your list?')) {
      this.apiService.deleteReadingEntry(id).subscribe({
        next: () => {
          this.entries = this.entries.filter(entry => entry.id !== id);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error while deleting:', err);
          alert('Failed to delete the book.');
        }
      });
    }
  }
}