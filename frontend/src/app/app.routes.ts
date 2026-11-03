import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Employees } from './employees/employees';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    component: Employees,
    canActivate: [authGuard]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];