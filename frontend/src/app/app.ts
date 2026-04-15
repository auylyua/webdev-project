import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  isLoggedIn = false;

  login() {
    this.isLoggedIn = true;
  }
}
