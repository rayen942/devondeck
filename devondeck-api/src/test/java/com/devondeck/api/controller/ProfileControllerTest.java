package com.devondeck.api.controller;

import com.devondeck.api.entity.DeveloperProfile;
import com.devondeck.api.repository.DeveloperProfileRepository;
import com.devondeck.api.repository.ProfileSkillRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'intégration MockMvc pour le profil développeur (US-10, US-09, etc.).
 * Profil H2 : base en mémoire, indépendante de PostgreSQL.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProfileControllerTest {

    @Autowired MockMvc mvc;
    @Autowired DeveloperProfileRepository profileRepo;
    @Autowired ProfileSkillRepository skillRepo;
    @Autowired ObjectMapper mapper;

    private Long profileId;

    @BeforeEach
    void setUp() {
        skillRepo.deleteAll();
        profileRepo.deleteAll();
        DeveloperProfile p = profileRepo.save(DeveloperProfile.builder().bio("").build());
        profileId = p.getId();
    }

    // ----------------------------------------------------------------
    //  US-10 – biographie
    // ----------------------------------------------------------------

    @Test
    @DisplayName("T10 – bio vide : 200 OK")
    void bio_empty_accepted() throws Exception {
        mvc.perform(put("/api/profiles/" + profileId + "/bio")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("bio", ""))))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("T10 – bio valide (120 chars) : 200 OK")
    void bio_valid() throws Exception {
        String bio = "a".repeat(120);
        mvc.perform(put("/api/profiles/" + profileId + "/bio")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("bio", bio))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bio").value(bio));
    }

    @Test
    @DisplayName("T10 – bio 501 caractères : 400 Bad Request")
    void bio_too_long() throws Exception {
        String bio = "x".repeat(501);
        mvc.perform(put("/api/profiles/" + profileId + "/bio")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("bio", bio))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    @DisplayName("T10 – profil 999 inexistant : 404")
    void bio_profile_not_found() throws Exception {
        mvc.perform(put("/api/profiles/999/bio")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("bio", "test"))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }

    // ----------------------------------------------------------------
    //  US-09 – Compétences
    // ----------------------------------------------------------------

    @Test
    @DisplayName("US-09 – Ajout compétence : 200 OK")
    void add_skill_ok() throws Exception {
        mvc.perform(put("/api/profiles/" + profileId + "/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("name", "React", "type", "FRAMEWORK"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills[0].name").value("React"))
                .andExpect(jsonPath("$.skills[0].type").value("FRAMEWORK"));
    }

    @Test
    @DisplayName("US-09 – Ajout compétence type invalide : 400 Bad Request")
    void add_skill_invalid_type() throws Exception {
        mvc.perform(put("/api/profiles/" + profileId + "/skills")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(Map.of("name", "React", "type", "INCONNU"))))
                .andExpect(status().isBadRequest());
    }

    // ----------------------------------------------------------------
    //  Lecture
    // ----------------------------------------------------------------

    @Test
    @DisplayName("GET – profil existant : 200 OK avec id")
    void get_profile_ok() throws Exception {
        mvc.perform(get("/api/profiles/" + profileId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(profileId));
    }

    @Test
    @DisplayName("GET – profil inexistant : 404")
    void get_profile_not_found() throws Exception {
        mvc.perform(get("/api/profiles/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }
}