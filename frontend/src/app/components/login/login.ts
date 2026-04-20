import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private api = inject(ApiService);
  private router = inject(Router);

  isLoginMode = true;
  username = '';
  email = '';
  password = '';
  errorMessage = '';

  setMode(mode: boolean) {
    this.isLoginMode = mode;
    this.errorMessage = '';
  }

onSubmit() {
    if (this.isLoginMode) {
      this.api.login({ username: this.username, password: this.password }).subscribe({
        next: (res) => {
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('username', res.username || this.username);
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.errorMessage = 'Invalid username or password';
        }
      });
    } else {
      this.api.register({
        username: this.username,
        email: this.email,
        password: this.password
      }).subscribe({
        next: (res) => {
          localStorage.setItem('access', res.access);
          localStorage.setItem('refresh', res.refresh);
          localStorage.setItem('username', res.username || this.username);
          this.router.navigate(['/catalog']);
        },
        error: (err) => {
          console.error('Registration failed', err);
          if (err.error?.username) {
            this.errorMessage = 'This username is already taken.';
          } else if (err.error?.password) {
            this.errorMessage = 'Password must be at least 6 characters.';
          } else {
            this.errorMessage = 'Registration failed. Try again.';
          }
        }
      });
    }
  }
}