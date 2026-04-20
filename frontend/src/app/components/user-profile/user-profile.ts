import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  user: any = null;
  reviews: any[] = [];
  collections: any[] = [];
  entries: any[] = [];
  activeTab: 'reviews' | 'collections' | 'reading' = 'reviews';

  isCollectionModalOpen = false;
  selectedCollection: any = null;
  likedCollections: number[] = [];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadProfile(id);
      this.loadReviews(id);
      this.loadCollections(id);
      this.loadEntries(id);
    }
  }

  loadProfile(id: number) {
    this.apiService.getPublicUserProfile(id).subscribe({
      next: (data) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: () => this.router.navigate(['/catalog'])
    });
  }

  loadReviews(id: number) {
    this.apiService.getPublicUserReviews(id).subscribe({
      next: (data) => {
        this.reviews = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.reviews = [];
      }
    });
  }

  loadCollections(id: number) {
    this.apiService.getUserCollections(id).subscribe({
      next: (data) => {
        this.collections = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.collections = [];
      }
    });
  }

  loadEntries(id: number) {
    this.apiService.getPublicUserEntries(id).subscribe({
      next: (data) => {
        this.entries = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.entries = [];
      }
    });
  }

  setTab(tab: 'reviews' | 'collections' | 'reading') {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    return status?.toLowerCase() || 'planned';
  }

  getColCovers(col: any): string[] {
    if (!col.books || col.books.length === 0) return [];
    return col.books.slice(0, 3).map((b: any) => b.cover_image).filter((img: string) => !!img);
  }

  openCollectionModal(col: any) {
    this.selectedCollection = col;
    this.isCollectionModalOpen = true;
  }

  closeCollectionModal() {
    this.isCollectionModalOpen = false;
    this.selectedCollection = null;
  }

  toggleCollectionLike(event: Event, collectionId: number) {
    event.stopPropagation();
    const index = this.likedCollections.indexOf(collectionId);
    if (index === -1) {
      this.likedCollections.push(collectionId);
    } else {
      this.likedCollections.splice(index, 1);
    }
  }

  isCollectionLiked(collectionId: number): boolean {
    return this.likedCollections.includes(collectionId);
  }

  openBook(id: number, event?: Event) {
    event?.stopPropagation();
    this.router.navigate(['/books', id]);
  }
}