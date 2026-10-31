import { Component, inject, effect } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { EmployeeService } from '../services/employee';

@Component({
  selector: 'app-dashboard',
  imports: [BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  employeeService = inject(EmployeeService);


  constructor() {
    effect(() => {
      const summary = this.departmentSummary();

      const departments = summary.map(item => item.department);
      const counts = summary.map(item => item.count);

      this.pieChartData = {
        ...this.pieChartData,
        labels: departments,
        datasets: [
          {
            ...this.pieChartData.datasets[0],
            data: counts
          }
        ]
      };

      this.barChartData = {
        ...this.barChartData,
        labels: departments,
        datasets: [
          {
            ...this.barChartData.datasets[0],
            data: counts
          }
        ]
      };


      const employees = this.employeeService.employees();

      const activeCount = employees.filter(
        employee => employee.status === 'Active'
      ).length;

      const onLeaveCount = employees.filter(
        employee => employee.status === 'On Leave'
      ).length;

      const inactiveCount = employees.filter(
        employee => employee.status === 'Inactive'
      ).length;

      this.doughnutChartData = {
        ...this.doughnutChartData,
        datasets: [
          {
            ...this.doughnutChartData.datasets[0],
            data: [activeCount, onLeaveCount, inactiveCount]
          }
        ]
      };

      const growth = this.getMonthlyEmployeeGrowth();

      this.lineChartData = {
        ...this.lineChartData,
        labels: growth.labels,
        datasets: [
          {
            ...this.lineChartData.datasets[0],
            data: growth.data
          }
        ]
      };
    });
  }

  get totalEmployees() {
    return this.employeeService.employees().length;
  }

  get totalDepartments() {
    return this.departmentSummary().length;
  }

  get activeEmployees() {
    return this.employeeService.employees().filter(
      employee => employee.status === 'Active'
    ).length;
  }

  get employeesOnLeave() {
    return this.employeeService.employees().filter(
      employee => employee.status === 'On Leave'
    ).length;
  }

  get inactiveEmployees() {
    return this.employeeService.employees().filter(
      employee => employee.status === 'Inactive'
    ).length;
  }

  getMonthlyEmployeeGrowth() {
    const employees = this.employeeService.employees();

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const currentYear = new Date().getFullYear();

    const monthlyCounts = months.map((month, index) => {
      return employees.filter(employee => {
        const joiningDate = new Date(employee.dateOfJoining);

        return (
          joiningDate.getFullYear() < currentYear ||
          (
            joiningDate.getFullYear() === currentYear &&
            joiningDate.getMonth() <= index
          )
        );
      }).length;
    });

    return {
      labels: months,
      data: monthlyCounts
    };
  }

  departmentSummary() {
    const employees = this.employeeService.employees();

    const departments = [...new Set(
      employees.map(employee => employee.department)
    )];

    return departments.map(department => ({
      department,
      count: employees.filter(
        employee => employee.department === department
      ).length
    }));
  }


  // Line chart: Employee growth
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Employees',
        data: [20, 25, 28, 35, 42, 50],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Pie chart: Department distribution
  pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          '#2563eb',
          '#16a34a',
          '#f59e0b',
          '#9333ea'
        ]
      }
    ]
  };

  // Bar chart: Employees by department
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Employees',
        data: [],
        backgroundColor: '#3b82f6',
        borderRadius: 6
      }
    ]
  };

  // Doughnut chart: Employee status
  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Active', 'On Leave', 'Inactive'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: [
          '#16a34a',
          '#f59e0b',
          '#ef4444'
        ]
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

}
