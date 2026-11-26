package com.devondeck.auth.organization;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class OrganizationAuthRequests {
    private OrganizationAuthRequests() {
    }

    public record Login(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {
    }

    public record Register(
            @NotBlank @Size(max = 160) String raisonSociale,
            @NotBlank @Size(max = 120) String secteur,
            @NotBlank @Size(max = 120) String ville,
            @Size(max = 255) String siteWeb,
            @NotBlank @Email @Size(max = 254) String email,
            @NotBlank @Size(min = 8) String password
    ) {
    }
}
