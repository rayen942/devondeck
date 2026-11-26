package com.devondeck.auth.security;

import java.time.Instant;

public record JwtPrincipal(Long id, String email, String role, String tokenId, Instant expiresAt) {
}
