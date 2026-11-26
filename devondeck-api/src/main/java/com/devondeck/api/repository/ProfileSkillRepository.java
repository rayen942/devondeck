package com.devondeck.api.repository;

import com.devondeck.api.entity.ProfileSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileSkillRepository extends JpaRepository<ProfileSkill, Long> {
    List<ProfileSkill> findByProfileId(Long profileId);
    void deleteByProfileId(Long profileId);
    Optional<ProfileSkill> findByIdAndProfileId(Long id, Long profileId);
}