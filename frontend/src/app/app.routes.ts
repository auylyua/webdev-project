import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Catalog } from './components/catalog/catalog';
import { Profile } from './components/profile/profile';
import { Collections } from './components/collections/collections';
import { Login } from './components/login/login';
import { MyProgress } from './components/my-progress/my-progress';
import { AuthComponent } from './components/auth/auth.component';
import { BookDetails } from './components/book-details/book-details';
import { authGuard } from './services/auth.guard';
import { UserProfile } from './components/user-profile/user-profile';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'catalog', component: Catalog, canActivate: [authGuard] },
  { path: 'books/:id', component: BookDetails },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'collections', component: Collections, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'my-progress', component: MyProgress, canActivate: [authGuard] },
  { path: 'auth', component: AuthComponent },
  { path: 'users/:id', component: UserProfile },
];