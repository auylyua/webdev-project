import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-my-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-progress.html',
  styleUrl: './my-progress.css'
})
export class MyProgressComponent implements OnInit {
  private apiService = inject(ApiService);
  activeEntries: any[] = [];

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