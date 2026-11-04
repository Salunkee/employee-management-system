
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    designation: string;
    status: 'Active' | 'On Leave' | 'Inactive';
    dateOfJoining: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private apiUrl = `${environment.apiUrl}/employees`;

    employees = signal<Employee[]>([]);

    constructor(private http: HttpClient) {
    }

    loadEmployees() {
        this.http.get<Employee[]>(this.apiUrl).subscribe({
            next: (data) => {
                this.employees.set(data);
            },
            error: (error) => {
                console.error('Error loading employees:', error);

                // Clear old employee data when API request fails
                this.employees.set([]);
            }
        });
    }

    addEmployee(employee: Omit<Employee, 'id'>) {
        return this.http.post<Employee>(this.apiUrl, employee);
    }

    updateEmployee(id: number, employee: Omit<Employee, 'id'>) {
        return this.http.put<Employee>(
            `${this.apiUrl}/${id}`,
            employee
        );
    }

    deleteEmployee(id: number) {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
