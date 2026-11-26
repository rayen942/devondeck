package com.devondeck.api.dto;

import java.util.List;

/**
 * Réponse renvoyée par GET /api/profiles/{id}.
 * Correspond exactement au contrat défini dans le cahier des charges.
 */
public record ProfileResponse(
        Long id,
        String bio,
        List<String> languages,
        List<SkillItem> skills
) {
    public record SkillItem(Long id, String name, String type) {}
}
