import { Routes } from '@angular/router';


import { Home } from './components/home/home';
import { Catalog } from './components/catalog/catalog';
import { Profile } from './components/profile/profile';
import { Collections } from './components/collections/collections';
import {Login} from "./components/login/login";
import {MyProgressComponent} from "./components/my-progress/my-progress";

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'catalog', component: Catalog },
  { path: 'profile', component: Profile },
  { path: 'collections', component: Collections },
  { path: 'login', component: Login},
  { path: 'my-progress', component: MyProgressComponent},
  { path: '', redirectTo: '/catalog', pathMatch: 'full' }
  
];

