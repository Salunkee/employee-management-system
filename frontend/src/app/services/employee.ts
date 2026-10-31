
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

    private apiUrl = 'http://localhost:8080/api/employees';

    employees = signal<Employee[]>([]);

    constructor(private http: HttpClient) {
        this.loadEmployees();
    }

    loadEmployees() {
        this.http.get<Employee[]>(this.apiUrl).subscribe({
            next: (data) => {
                this.employees.set(data);
            },
            error: (error) => {
                console.error('Error loading employees:', error);
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
