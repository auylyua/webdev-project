import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Поля для привязки к форме (ngModel)
  email = '';
  password = '';
  username = ''; // Добавлено, если в шаблоне используется для регистрации
  
  isLoginMode = true;
  errorMessage = '';

  // Метод переключения режима (Sign In / Register)
  setMode(mode: boolean) {
    this.isLoginMode = mode;
    this.errorMessage = '';
  }

  // Метод для входа
  onSignIn() {
    this.authService.login({ username: this.email, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.errorMessage = 'Ошибка входа. Проверьте логин и пароль.';
        console.error(err);
      }
    });
  }

  // Метод для регистрации
  onRegister() {
    // Если в шаблоне для регистрации используется email как username
    const registrationData = {
      username: this.email, 
      password: this.password
    };

    this.authService.register(registrationData).subscribe({
      next: () => {
        alert('Регистрация успешна! Теперь вы можете войти.');
        this.isLoginMode = true;
      },
      error: (err: any) => {
        this.errorMessage = 'Ошибка регистрации. Возможно, пользователь уже существует.';
        console.error(err);
      }
    });
  }
}