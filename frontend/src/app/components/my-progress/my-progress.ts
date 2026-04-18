import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-my-progress',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-progress.html',
  styleUrl: './my-progress.css'
})
export class MyProgress implements OnInit {
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  
  entries: any[] = [];         
  
  // Состояние модального окна
  isModalOpen = false;
  selectedEntry: any = null;

  // Поля формы редактирования
  editData = {
    current_page: 0,
    status: 'reading',
    rating: 0
  };

  ngOnInit() {
    this.loadProgress();
  }

  loadProgress() {
    const token = localStorage.getItem('access');
    if (token) {
      this.apiService.getReadingEntries(token).subscribe({
        next: (data: any[]) => {
          console.log('Data from server:', data);
          this.entries = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка загрузки:', err)
      });
    }
  }

  // Открыть модалку и заполнить её текущими данными
  openEditModal(entry: any) {
    this.selectedEntry = entry;
    this.editData = {
      current_page: entry.current_page,
      status: entry.status,
      rating: entry.rating || 0
    };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEntry = null;
  }

  saveChanges() {
    const token = localStorage.getItem('access');
    if (token && this.selectedEntry) {
      this.apiService.updateProgress(token, this.selectedEntry.id, this.editData).subscribe({
        next: () => {
          this.closeModal();
          this.loadProgress();
        },
        error: (err) => alert('Ошибка при сохранении')
      });
    }
  }
}