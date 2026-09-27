import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../employee';

@Component({
  selector: 'app-employee-detail',
  imports: [RouterLink],
  templateUrl: './employee-detail.html',
  styleUrl: './employee-detail.scss',
})
export class EmployeeDetail {
  private readonly http = inject(HttpClient);

  id = input.required<string>();

  employees = signal<Employee[]>([]);
  employee = computed(() => this.employees().find((employee) => employee.id === Number(this.id())));

  constructor() {
    this.http
      .get<Employee[]>('/imaEmployees.json')
      .subscribe((employees) => this.employees.set(employees));
  }
}
