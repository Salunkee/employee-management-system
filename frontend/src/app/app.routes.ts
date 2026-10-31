
import { Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { Employees } from './employees/employees';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'employees',
    component: Employees
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];
