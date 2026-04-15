import { Routes } from '@angular/router';


import { Home } from './components/home/home';
import { Catalog } from './components/catalog/catalog';
import { Profile } from './components/profile/profile';
import { Collections } from './components/collections/collections';
import {Login} from "./components/login/login";

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'catalog', component: Catalog },
  { path: 'profile', component: Profile },
  { path: 'collections', component: Collections },
  {path: 'login', component: Login}
];

