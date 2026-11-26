package com.devondeck.api.service;

import com.devondeck.api.dto.ProfileResponse;
import com.devondeck.api.entity.DeveloperProfile;
import com.devondeck.api.exception.NotFoundException;
import com.devondeck.api.repository.DeveloperProfileRepository;
import com.devondeck.api.repository.ProfileSkillRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProfileSkillServiceTest {

    @Autowired ProfileService profileService;
    @Autowired DeveloperProfileRepository profileRepo;
    @Autowired ProfileSkillRepository skillRepo;

    private Long profileId;

    @BeforeEach
    void setUp() {
        skillRepo.deleteAll();
        profileRepo.deleteAll();
        DeveloperProfile profile = profileRepo.save(DeveloperProfile.builder().bio("").build());
        profileId = profile.getId();
    }

    @Test
    @DisplayName("US-09 – Ajout d'une compétence valide")
    void addSkill_valid() {
        ProfileResponse response = profileService.addSkill(profileId, "React", "FRAMEWORK");

        assertNotNull(response);
        assertEquals(1, response.skills().size());
        assertEquals("React", response.skills().get(0).name());
        assertEquals("FRAMEWORK", response.skills().get(0).type());
    }

    @Test
    @DisplayName("US-09 – Erreur si doublon de compétence insensible à la casse")
    void addSkill_duplicate() {
        profileService.addSkill(profileId, "Spring Boot", "FRAMEWORK");

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                profileService.addSkill(profileId, "spring boot", "FRAMEWORK")
        );
        assertTrue(ex.getMessage().contains("déjà dans votre profil"));
    }

    @Test
    @DisplayName("US-09 – Erreur si type invalide")
    void addSkill_invalidType() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                profileService.addSkill(profileId, "Docker", "AUTRE_TYPE")
        );
        assertTrue(ex.getMessage().contains("invalide"));
    }

    @Test
    @DisplayName("US-09 – Suppression d'une compétence existante")
    void removeSkill_valid() {
        ProfileResponse created = profileService.addSkill(profileId, "PostgreSQL", "COMPETENCE");
        Long skillId = created.skills().get(0).id();

        profileService.removeSkill(profileId, skillId);

        ProfileResponse after = profileService.getProfile(profileId);
        assertTrue(after.skills().isEmpty());
    }

    @Test
    @DisplayName("US-09 – Suppression compétence inexistante lève NotFoundException")
    void removeSkill_notFound() {
        assertThrows(NotFoundException.class, () ->
                profileService.removeSkill(profileId, 9999L)
        );
    }
}