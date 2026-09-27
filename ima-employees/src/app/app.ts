import { Component, signal } from '@angular/core';
import { Counter } from './counter/counter';
import { EmployeeList } from './employee-list/employee-list';

@Component({
  selector: 'app-root',
  imports: [Counter, EmployeeList],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('ima-employees');
}
