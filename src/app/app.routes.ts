import { Routes } from '@angular/router';
import { Home } from './core/home/home';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  {
    path: 'auth',
    loadComponent: () => import('./auth/login/login').then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register').then(m => m.Register)
  },
  {
    path: 'availability',
    loadComponent: () => import('./availability/availability').then(m => m.Availability)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./bookings/bookings').then(m => m.Bookings)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
  },
  { path: '**', redirectTo: '' }
];