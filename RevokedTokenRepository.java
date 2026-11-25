package com.devondeck.auth.shared;

import java.time.Instant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    long deleteByExpiresAtBefore(Instant instant);
}
