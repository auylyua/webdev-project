import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true; 
  errorMessage: string = '';

  onSubmit(form: any) {
    if (form.invalid) return;

    const { username, email, password } = form.value;

    if (this.isLoginMode) {
      
      this.authService.login({ username, password }).subscribe({
        next: () => this.router.navigate(['/my-progress']),
        error: (err) => this.errorMessage = 'Invalid username or password'
      });
    } else {
      
      this.authService.register({ username, email, password }).subscribe({
        next: () => {
          this.isLoginMode = true; 
          alert('Registration successful! Now please login.');
        },
        error: (err) => this.errorMessage = 'Registration failed. Try another username.'
      });
    }
  }
}