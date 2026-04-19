import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private apiService = inject(ApiService);
  public authService = inject(AuthService); 

  homeData: any = null;
  lastActiveBook: any = null; 
  ngOnInit() {
    this.loadHomeData();
  }

  loadHomeData() {
    const token = localStorage.getItem('access');
    if (token) {
      this.apiService.getLastActiveBook().subscribe({
        next: (data: any) => {
          this.homeData = data;
          
          if (data && data.last_active_book) {
            this.lastActiveBook = data.last_active_book;
          }
          console.log('Данные загружены:', data);
        },
        error: (err: any) => {
          console.error('Ошибка загрузки статистики:', err);
        }
      });
    }
  }
}