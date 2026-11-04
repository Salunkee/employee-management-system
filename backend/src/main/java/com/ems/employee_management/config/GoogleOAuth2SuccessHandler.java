
package com.ems.employee_management.config;

import com.ems.employee_management.dto.AuthResponse;
import com.ems.employee_management.service.AuthService;
import com.ems.employee_management.service.OAuthCodeService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class GoogleOAuth2SuccessHandler
        implements AuthenticationSuccessHandler {

    private final AuthService authService;
    private final OAuthCodeService oauthCodeService;

    @Value("${app.oauth2.frontend-redirect-uri}")
    private String frontendRedirectUri;

    public GoogleOAuth2SuccessHandler(
            AuthService authService,
            OAuthCodeService oauthCodeService) {

        this.authService = authService;
        this.oauthCodeService = oauthCodeService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        if (!(authentication.getPrincipal() instanceof OidcUser googleUser)) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid Google authentication");
            return;
        }

        String email = googleUser.getEmail();

        Boolean emailVerified = googleUser.getClaim("email_verified");

        if (email == null || !Boolean.TRUE.equals(emailVerified)) {
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Google email is not verified");
            return;
        }

        AuthResponse authResponse = authService.googleLogin(email);

        String code = oauthCodeService.generateCode(authResponse);

        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendRedirectUri)
                .queryParam("code", code)
                .build()
                .encode()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
