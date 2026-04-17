// login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  isLoginMode = true;
  username = '';
  email = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  setMode(mode: boolean) {
    this.isLoginMode = mode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.api.login({ username: this.username, password: this.password }).subscribe({
        next: (res) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          window.location.href = '/home'; // простой вариант
        },
        error: (err) => console.error('Login failed', err)
      });
    } else {
      this.api.register({ username: this.username, email: this.email, password: this.password }).subscribe({
        next: (res) => {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
          window.location.href = '/home';
        },
        error: (err) => console.error('Registration failed', err)
      });
    }
  }
}