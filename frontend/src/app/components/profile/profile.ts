import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  user: any = { email: localStorage.getItem('userEmail') || 'User' };
  notes: any[] = [];
  reviews: any[] = [];

  ngOnInit() {
    this.loadProfileData();
  }

  loadProfileData() {
    const token = localStorage.getItem('access');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    
    this.apiService.getUserNotes().subscribe({
      next: (data: any) => {
        this.notes = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading notes:', err)
    });

    
    this.apiService.getUserReviews().subscribe({
      next: (data: any) => {
        this.reviews = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  goToCatalog() {
    this.router.navigate(['/catalog']);
  }
}