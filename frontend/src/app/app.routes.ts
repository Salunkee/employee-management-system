import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Employees } from './employees/employees';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { authGuard } from './guards/auth-guard';
import { OAuth2CallbackComponent } from './components/oauth2-callback/oauth2-callback.component';

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
  {
    path: 'oauth2/callback',
    component: OAuth2CallbackComponent
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];