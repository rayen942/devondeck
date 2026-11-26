package com.devondeck.api.service;

import com.devondeck.api.dto.ProfileResponse;
import com.devondeck.api.entity.DeveloperProfile;
import com.devondeck.api.exception.NotFoundException;
import com.devondeck.api.repository.DeveloperProfileRepository;
import com.devondeck.api.repository.ProfileLanguageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProfileLanguageServiceTest {

    @Autowired ProfileService profileService;
    @Autowired DeveloperProfileRepository profileRepo;
    @Autowired ProfileLanguageRepository languageRepo;

    private Long profileId;

    @BeforeEach
    void setUp() {
        languageRepo.deleteAll();
        profileRepo.deleteAll();
        DeveloperProfile profile = profileRepo.save(DeveloperProfile.builder().bio("").build());
        profileId = profile.getId();
    }

    @Test
    @DisplayName("T8.7 – Enregistrement valide jusqu'à 5 langages")
    void updateLanguages_valid() {
        List<String> langs = List.of("Java", "TypeScript", "Python", "Go", "Rust");
        ProfileResponse response = profileService.updateLanguages(profileId, langs);

        assertNotNull(response);
        assertEquals(5, response.languages().size());
        assertTrue(response.languages().contains("Java"));
        assertTrue(response.languages().contains("Rust"));
    }

    @Test
    @DisplayName("T8.7 – Erreur si plus de 5 langages (ex. 6)")
    void updateLanguages_tooMany() {
        List<String> langs = List.of("Java", "TypeScript", "Python", "Go", "Rust", "C++");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                profileService.updateLanguages(profileId, langs)
        );
        assertTrue(ex.getMessage().contains("plus de 5 langages"));
    }

    @Test
    @DisplayName("T8.7 – Erreur si doublon insensible à la casse")
    void updateLanguages_duplicateCaseInsensitive() {
        List<String> langs = List.of("Java", "java");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                profileService.updateLanguages(profileId, langs)
        );
        assertTrue(ex.getMessage().contains("Doublon détecté"));
    }

    @Test
    @DisplayName("T8.7 – Erreur si langage vide")
    void updateLanguages_emptyLanguage() {
        List<String> langs = List.of("Java", "   ");
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                profileService.updateLanguages(profileId, langs)
        );
        assertTrue(ex.getMessage().contains("ne peut pas être vide"));
    }

    @Test
    @DisplayName("T8.7 – Profil inexistant lève NotFoundException")
    void updateLanguages_profileNotFound() {
        assertThrows(NotFoundException.class, () ->
                profileService.updateLanguages(9999L, List.of("Java"))
        );
    }
}
