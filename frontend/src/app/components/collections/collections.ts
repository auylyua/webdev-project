import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './collections.html',
  styleUrl: './collections.css'
})
export class Collections implements OnInit {
  collections: any[] = [];
  allBooks: any[] = [];
  filteredBooks: any[] = [];

  isCreateOpen = false;
  bookSearch = '';

  newCollection = {
    title: '',
    description: '',
    is_public: true,
    selectedBooks: [] as any[]
  };

  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadCollections();
    this.api.getBooksFiltered().subscribe({
      next: (data) => { this.allBooks = data; this.filteredBooks = data; }
    });
  }

  loadCollections() {
    this.api.getMyCollections().subscribe({
      next: (data) => { this.collections = data; this.cdr.detectChanges(); }
    });
  }

  openCreate() {
    this.isCreateOpen = true;
    this.newCollection = { title: '', description: '', is_public: true, selectedBooks: [] };
    this.bookSearch = '';
    this.filteredBooks = this.allBooks;
  }

  closeCreate() { this.isCreateOpen = false; }

  searchBooks() {
    const q = this.bookSearch.toLowerCase();
    this.filteredBooks = this.allBooks.filter(b =>
      b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }

  toggleBook(book: any) {
    const idx = this.newCollection.selectedBooks.findIndex(b => b.id === book.id);
    if (idx === -1) {
      this.newCollection.selectedBooks.push(book);
    } else {
      this.newCollection.selectedBooks.splice(idx, 1);
    }
  }

  isSelected(book: any): boolean {
    return this.newCollection.selectedBooks.some(b => b.id === book.id);
  }

  saveCollection() {
    if (!this.newCollection.title.trim()) { alert('Enter a title!'); return; }

    this.api.createCollection({
      title: this.newCollection.title,
      description: this.newCollection.description,
      is_public: this.newCollection.is_public
    }).subscribe({
      next: (col: any) => {
        const bookRequests = this.newCollection.selectedBooks.map(b =>
          this.api.addBookToCollection(col.id, b.id)
        );

        if (bookRequests.length === 0) {
          this.collections.unshift(col);
          this.closeCreate();
          this.cdr.detectChanges();
          return;
        }

        let done = 0;
        bookRequests.forEach(req => req.subscribe({
          next: () => {
            done++;
            if (done === bookRequests.length) {
              this.loadCollections();
              this.closeCreate();
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
      this.api.deleteCollection(id).subscribe({
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
}