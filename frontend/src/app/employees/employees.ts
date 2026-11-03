
import { FormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../services/employee';
import { Component, OnInit, inject } from '@angular/core';


@Component({
  selector: 'app-employees',
  imports: [FormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit {

  employeeService = inject(EmployeeService);

  searchText: string = '';

  showAddEmployeeForm = false;

  newEmployee = {
    name: '',
    email: '',
    department: '',
    designation: '',
    status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
    dateOfJoining: ''
  };

  // Controls whether we are editing an employee
  isEditMode = false;

  // Stores the ID of the employee being edited
  editingEmployeeId: number | null = null;

  get employeeCount() {
    return this.employeeService.employees().length;
  }

  get filteredEmployees() {
    const search = this.searchText.toLowerCase().trim();

    return this.employeeService.employees().filter(employee =>
      employee.name.toLowerCase().includes(search) ||
      employee.email.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search) ||
      employee.designation.toLowerCase().includes(search)
    );
  }

  ngOnInit() {
    this.employeeService.loadEmployees();
  }

  get userRole(): string {
    return sessionStorage.getItem('role') || '';
  }

  addEmployee() {
    this.employeeService.addEmployee(this.newEmployee).subscribe({
      next: (savedEmployee) => {
        this.employeeService.employees.update(employees => [
          ...employees,
          savedEmployee
        ]);

        this.cancelForm();

        alert('Employee added successfully!');
      },
      error: (error) => {
        console.error('Error adding employee:', error);
        alert('Failed to add employee. Please try again.');
      }
    });
  }


  editEmployee(employee: Employee) {
    this.isEditMode = true;

    this.editingEmployeeId = employee.id;

    this.newEmployee = {
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      status: employee.status,
      dateOfJoining: employee.dateOfJoining
    };

    this.showAddEmployeeForm = true;
  }

  updateEmployee() {
    if (this.editingEmployeeId === null) {
      return;
    }

    this.employeeService.updateEmployee(
      this.editingEmployeeId,
      this.newEmployee
    ).subscribe({
      next: (updatedEmployee) => {
        this.employeeService.employees.update(employees =>
          employees.map(employee =>
            employee.id === updatedEmployee.id
              ? updatedEmployee
              : employee
          )
        );

        this.cancelForm();

        alert('Employee updated successfully!');
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        alert('Failed to update employee.');
      }
    });
  }

  cancelForm() {
    this.showAddEmployeeForm = false;
    this.isEditMode = false;
    this.editingEmployeeId = null;

    this.newEmployee = {
      name: '',
      email: '',
      department: '',
      designation: '',
      status: 'Active' as 'Active' | 'On Leave' | 'Inactive',
      dateOfJoining: ''
    };
  }


  deleteEmployee(employeeId: number) {

    const confirmDelete = confirm(
      'Are you sure you want to delete this employee?'
    );

    if (confirmDelete) {

      this.employeeService.deleteEmployee(employeeId).subscribe({
        next: () => {
          this.employeeService.employees.update(employees =>
            employees.filter(employee => employee.id !== employeeId)
          );

          alert('Employee deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee.');
        }
      });

    }
  }





}
