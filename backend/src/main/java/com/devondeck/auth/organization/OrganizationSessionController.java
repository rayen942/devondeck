package com.devondeck.auth.organization;

import com.devondeck.auth.security.JwtPrincipal;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/organisation")
public class OrganizationSessionController {
    @GetMapping("/session")
    public OrganizationSession currentSession(@AuthenticationPrincipal JwtPrincipal principal) {
        return new OrganizationSession(principal.id(), principal.email(), principal.role());
    }

    public record OrganizationSession(Long id, String email, String role) {
    }
}
