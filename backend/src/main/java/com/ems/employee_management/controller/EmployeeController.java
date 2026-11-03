
package com.ems.employee_management.controller;

import com.ems.employee_management.entity.Employee;
import com.ems.employee_management.service.EmployeeService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = {
        "http://localhost:4200",
        "https://employee-management-system-98x.pages.dev"
})
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // ADMIN, HR and USER can view all employees
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // ADMIN, HR and USER can view an employee by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'USER')")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    // ADMIN and HR can add employees
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeService.saveEmployee(employee);
    }

    // ADMIN and HR can update employees
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    public Employee updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        Employee existingEmployee = employeeService.getEmployeeById(id);

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setDesignation(employee.getDesignation());
        existingEmployee.setStatus(employee.getStatus());
        existingEmployee.setDateOfJoining(employee.getDateOfJoining());

        return employeeService.saveEmployee(existingEmployee);
    }

    // Only ADMIN can delete employees
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
    }
}
