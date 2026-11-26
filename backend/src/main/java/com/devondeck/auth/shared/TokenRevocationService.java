package com.devondeck.auth.shared;

import java.time.Instant;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TokenRevocationService {
    private final RevokedTokenRepository revokedTokens;

    public TokenRevocationService(RevokedTokenRepository revokedTokens) {
        this.revokedTokens = revokedTokens;
    }

    @Transactional
    public void revoke(String tokenId, Instant expiresAt) {
        revokedTokens.save(new RevokedToken(tokenId, expiresAt));
    }

    @Transactional(readOnly = true)
    public boolean isRevoked(String tokenId) {
        return revokedTokens.existsById(tokenId);
    }

    @Scheduled(fixedRateString = "${app.jwt.revocation-cleanup-ms:3600000}")
    @Transactional
    public void removeExpiredRevocations() {
        revokedTokens.deleteByExpiresAtBefore(Instant.now());
    }
}
