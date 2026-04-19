import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

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

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    console.log('Токен найден:', token);

    this.apiService.getReadingEntries().subscribe({
      next: (data) => {
        console.log('Данные из Django:', data);
        this.activeEntries = data;
      },
      error: (err) => console.error('Ошибка API:', err)
    });
  }
}