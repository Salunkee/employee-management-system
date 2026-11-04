
package com.ems.employee_management.service;

import com.ems.employee_management.dto.AuthResponse;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OAuthCodeService {

    private record CodeEntry(
            AuthResponse response,
            Instant expiresAt) {
    }

    private final ConcurrentHashMap<String, CodeEntry> codes = new ConcurrentHashMap<>();

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateCode(AuthResponse response) {

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String code = Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);

        codes.put(code, new CodeEntry(
                response,
                Instant.now().plusSeconds(60)));

        return code;
    }

    public AuthResponse consumeCode(String code) {

        CodeEntry entry = codes.remove(code);

        if (entry == null || Instant.now().isAfter(entry.expiresAt())) {
            return null;
        }

        return entry.response();
    }
}
