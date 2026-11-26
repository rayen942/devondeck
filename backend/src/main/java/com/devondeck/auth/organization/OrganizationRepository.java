package com.devondeck.auth.organization;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
