package com.devondeck.auth.joboffer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public final class JobOfferRequests {
    private JobOfferRequests() {
    }

    public record Create(
            @NotBlank @Size(max = 160) String title,
            @NotBlank @Size(max = 5000) String description,
            @NotEmpty @Size(max = 30) List<@NotBlank @Size(max = 50) String> skills
    ) {
    }
}
