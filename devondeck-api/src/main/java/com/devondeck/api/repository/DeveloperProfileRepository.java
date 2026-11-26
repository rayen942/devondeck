package com.devondeck.api.repository;

import com.devondeck.api.entity.DeveloperProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeveloperProfileRepository extends JpaRepository<DeveloperProfile, Long> {
}
