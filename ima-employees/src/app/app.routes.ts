import { Routes } from '@angular/router';
import { Counter } from './counter/counter';
import { EmployeeDetail } from './employee-detail/employee-detail';
import { EmployeeList } from './employee-list/employee-list';
import { PageNotFound } from './page-not-found/page-not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeList },
  { path: 'employees/:id', component: EmployeeDetail },
  { path: 'counter', component: Counter },
  { path: '**', component: PageNotFound },
];
