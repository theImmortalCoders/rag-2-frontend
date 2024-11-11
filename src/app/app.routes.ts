import { Routes } from '@angular/router';
import { HomePageComponent } from './home/home.page.component';
import { GamePageComponent } from './game/game.page.component';
import { LoginPageComponent } from './user-workflow/login/login.page.component';
import { RegisterPageComponent } from './user-workflow/register/register.page.component';
import { Error404PageComponent } from './shared/components/error-pages/error404.page.component';
import { Error500PageComponent } from './shared/components/error-pages/error500.page.component';
import { RegisterConfirmComponent } from './user-workflow/register/components/register-confirm.component';
import { ResetPasswordComponent } from './user-workflow/login/components/reset-password.component';
import { DashboardPageComponent } from './dashboard/dashboard.page.component';
import { authGuard } from '@utils/helpers/auth.guard';
import { guestGuard } from '@utils/helpers/guest.guard';
import { GameListPageComponent } from './game-list/game-list.page.component';

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
    path: 'dashboard',
    component: DashboardPageComponent,
    title: 'Dashboard Page',
    canActivate: [authGuard],
  },
  {
    path: 'game/:gameName',
    component: GamePageComponent,
    title: 'Game Page',
  },
  {
    path: 'game-list',
    component: GameListPageComponent,
    title: 'Game List Page',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        component: LoginPageComponent,
        title: 'Login Page',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'Reset Password Page',
      },
    ],
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        component: RegisterPageComponent,
        title: 'Register Page',
      },
      {
        path: 'confirm',
        component: RegisterConfirmComponent,
        title: 'Register Confirm Page',
      },
    ],
  },
  {
    path: 'error404',
    component: Error404PageComponent,
    title: 'Error 404',
  },
  {
    path: 'error500',
    component: Error500PageComponent,
    title: 'Error 500',
  },
  {
    path: '**',
    redirectTo: 'error404',
    pathMatch: 'full',
  },
];
