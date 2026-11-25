package com.devondeck.profile;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeveloperProfileRepository extends JpaRepository<DeveloperProfile, Long> {
  Optional<DeveloperProfile> findByAccountId(Long accountId);
}
