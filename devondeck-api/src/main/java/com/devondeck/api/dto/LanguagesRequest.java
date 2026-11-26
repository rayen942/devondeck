package com.devondeck.api.dto;

import java.util.List;

/**
 * Corps de la requête PUT /api/profiles/{id}/languages
 */
public record LanguagesRequest(
        List<String> languages
) {}
