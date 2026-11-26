package com.devondeck.api.dto;

import jakarta.validation.constraints.Size;

/**
 * Corps de la requête PUT /api/profiles/{id}/bio
 */
public record BioRequest(
        @Size(max = 500, message = "La biographie ne peut pas dépasser 500 caractères.")
        String bio
) {}
