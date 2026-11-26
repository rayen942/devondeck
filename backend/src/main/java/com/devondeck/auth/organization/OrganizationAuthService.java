package com.devondeck.auth.organization;

import com.devondeck.auth.shared.ApiExceptions.Conflict;
import com.devondeck.auth.shared.ApiExceptions.InvalidInput;
import com.devondeck.auth.shared.ApiExceptions.InvalidCredentials;
import com.devondeck.auth.shared.JwtService;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;

@Service
public class OrganizationAuthService {
    private static final String ROLE = "ORGANISATION";

    private final OrganizationRepository organizations;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public OrganizationAuthService(OrganizationRepository organizations,
                                   PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.organizations = organizations;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public OrganizationResponse register(OrganizationAuthRequests.Register request) {
        ensureBcryptPasswordLength(request.password());
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (organizations.existsByEmailIgnoreCase(email)) {
            throw new Conflict("Une organisation utilise déjà cette adresse e-mail.");
        }

        Organization organization = organizations.save(new Organization(
                request.raisonSociale().trim(),
                request.secteur().trim(),
                request.ville().trim(),
                request.siteWeb() == null || request.siteWeb().isBlank() ? null : request.siteWeb().trim(),
                email,
                passwordEncoder.encode(request.password())
        ));
        return new OrganizationResponse(organization.getId(), organization.getEmail(), ROLE);
    }

    @Transactional(readOnly = true)
    public LoginResponse login(OrganizationAuthRequests.Login request) {
        ensureBcryptPasswordLength(request.password());
        Organization organization = organizations.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new InvalidCredentials("E-mail ou mot de passe incorrect."));
        if (!passwordEncoder.matches(request.password(), organization.getPasswordHash())) {
            throw new InvalidCredentials("E-mail ou mot de passe incorrect.");
        }
        JwtService.IssuedToken issuedToken = jwtService.createToken(
                organization.getId(), organization.getEmail(), ROLE);
        return new LoginResponse(issuedToken.value(), organization.getId(),
                organization.getEmail(), ROLE, issuedToken.expiresAt());
    }

    private void ensureBcryptPasswordLength(String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new InvalidInput("Le mot de passe ne doit pas dépasser 72 octets.");
        }
    }

    public record OrganizationResponse(Long id, String email, String role) {
    }

    public record LoginResponse(String token, Long id, String email, String role, Instant expiresAt) {
    }
}
