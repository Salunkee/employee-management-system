
package com.ems.employee_management.controller;

import com.ems.employee_management.dto.AuthResponse;
import com.ems.employee_management.service.OAuthCodeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/oauth2")
public class OAuth2Controller {

    private final OAuthCodeService oauthCodeService;

    public OAuth2Controller(OAuthCodeService oauthCodeService) {
        this.oauthCodeService = oauthCodeService;
    }

    @PostMapping("/exchange")
    public ResponseEntity<?> exchangeCode(
            @RequestBody Map<String, String> request) {

        String code = request.get("code");

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Authorization code is required");
        }

        AuthResponse authResponse = oauthCodeService.consumeCode(code);

        if (authResponse == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid or expired authorization code");
        }

        return ResponseEntity.ok(authResponse);
    }
}
