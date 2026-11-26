package com.devondeck.api.controller;

import com.devondeck.api.dto.BioRequest;
import com.devondeck.api.dto.LanguagesRequest;
import com.devondeck.api.dto.ProfileResponse;
import com.devondeck.api.dto.SkillRequest;
import com.devondeck.api.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST – profil développeur.
 */
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // ----------------------------------------------------------------
    //  P4 – GET /api/profiles/{id}
    // ----------------------------------------------------------------

    @GetMapping("/{id}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    // ----------------------------------------------------------------
    //  US-10 – PUT /api/profiles/{id}/bio
    // ----------------------------------------------------------------

    @PutMapping("/{id}/bio")
    public ResponseEntity<ProfileResponse> updateBio(
            @PathVariable Long id,
            @Valid @RequestBody BioRequest body) {
        return ResponseEntity.ok(profileService.updateBio(id, body.bio()));
    }

    // ----------------------------------------------------------------
    //  US-08 – PUT /api/profiles/{id}/languages
    // ----------------------------------------------------------------

    @PutMapping("/{id}/languages")
    public ResponseEntity<ProfileResponse> updateLanguages(
            @PathVariable Long id,
            @RequestBody LanguagesRequest body) {
        return ResponseEntity.ok(profileService.updateLanguages(id, body != null ? body.languages() : null));
    }

    // ----------------------------------------------------------------
    //  US-09 – PUT /api/profiles/{id}/skills
    // ----------------------------------------------------------------

    @PutMapping("/{id}/skills")
    public ResponseEntity<ProfileResponse> addSkill(
            @PathVariable Long id,
            @Valid @RequestBody SkillRequest body) {
        return ResponseEntity.ok(profileService.addSkill(id, body.name(), body.type()));
    }

    // ----------------------------------------------------------------
    //  US-09 – DELETE /api/profiles/{profileId}/skills/{skillId}
    // ----------------------------------------------------------------

    @DeleteMapping("/{profileId}/skills/{skillId}")
    public ResponseEntity<Void> removeSkill(
            @PathVariable Long profileId,
            @PathVariable Long skillId) {
        profileService.removeSkill(profileId, skillId);
        return ResponseEntity.noContent().build();
    }
}