package com.devondeck.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record SkillRequest(
        @NotBlank(message = "Le nom de la compétence est obligatoire.")
        String name,

        @NotBlank(message = "Le type de la compétence est obligatoire.")
        @Pattern(regexp = "FRAMEWORK|BIBLIOTHEQUE|COMPETENCE", message = "Le type sélectionné est invalide.")
        String type
) {}