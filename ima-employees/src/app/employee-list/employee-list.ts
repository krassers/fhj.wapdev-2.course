import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-list',
  imports: [ReactiveFormsModule],
  templateUrl: './employee-list.html',
  styleUrl: './employee-list.scss',
})
export class EmployeeList {
  private readonly http = inject(HttpClient);

  employees = signal<Employee[]>([]);

  filter = new FormControl('', { nonNullable: true });
  query = signal('');

  filtered = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.employees().filter((employee) => employee.name.toLowerCase().includes(query));
  });

  constructor() {
    this.http
      .get<Employee[]>('/imaEmployees.json')
      .subscribe((employees) => this.employees.set(employees));

    this.filter.valueChanges.subscribe((value) => this.query.set(value));
  }
}
