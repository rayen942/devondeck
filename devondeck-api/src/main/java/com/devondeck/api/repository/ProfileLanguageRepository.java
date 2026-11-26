package com.devondeck.api.repository;

import com.devondeck.api.entity.ProfileLanguage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileLanguageRepository extends JpaRepository<ProfileLanguage, Long> {
    List<ProfileLanguage> findByProfileId(Long profileId);
    void deleteByProfileId(Long profileId);
}
