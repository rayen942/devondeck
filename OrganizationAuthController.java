package com.devondeck.auth.organization;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/organisation")
public class OrganizationAuthController {
    private final OrganizationAuthService authService;

    public OrganizationAuthController(OrganizationAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public OrganizationAuthService.OrganizationResponse register(
            @Valid @RequestBody OrganizationAuthRequests.Register request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public OrganizationAuthService.LoginResponse login(
            @Valid @RequestBody OrganizationAuthRequests.Login request) {
        return authService.login(request);
    }
}
