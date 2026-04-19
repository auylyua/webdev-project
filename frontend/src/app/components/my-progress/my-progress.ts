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
  isModalOpen: boolean = false;
  selectedEntry: any = null;
  editData: any = {};

  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    
    this.apiService.getReadingEntries().subscribe({
      next: (data: any) => {
        this.entries = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Ошибка API:', err)
    });
  }

  openEditModal(entry: any) {
    this.selectedEntry = entry;
    this.editData = { ...entry };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedEntry = null;
  }

  saveChanges() {
    
    this.apiService.updateReadingEntry(this.editData.id, this.editData).subscribe({
      next: () => {
        this.closeModal();
        this.ngOnInit(); 
      },
      error: (err: any) => console.error('Ошибка сохранения:', err)
    });
  }
}