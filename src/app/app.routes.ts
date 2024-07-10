import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home.page.component';
import { GamePageComponent } from './game/game.page.component';
import { LoginPageComponent } from './user-workflow/login/login.page.component';
import { RegisterPageComponent } from './user-workflow/register/register.page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
    title: 'Home Page',
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'game/:gameName',
    component: GamePageComponent,
    title: 'Game Page',
  },
  {
    path: 'login',
    component: LoginPageComponent,
    title: 'Login Page',
  },
  {
    path: 'register',
    component: RegisterPageComponent,
    title: 'Register Page',
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
