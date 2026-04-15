import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private apiService = inject(ApiService);

 

  
  lastActiveBook: any = {
    book_title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    current_page: 142,
    total_pages: 180,
    progress_percent: 78
  };

  ngOnInit(): void {
   
    
  }
}