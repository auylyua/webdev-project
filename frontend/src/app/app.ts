import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Обязательно добавь это

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule], // Добавь RouterModule в импорты
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  isLoggedIn = false;

  login() {
    this.isLoggedIn = true;
  }
}