
package com.ems.employee_management.dto;

public record AuthResponse(
        String token,
        String username,
        String role) {
}
