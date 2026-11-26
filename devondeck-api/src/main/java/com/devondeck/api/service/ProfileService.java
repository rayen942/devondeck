package com.devondeck.api.service;

import com.devondeck.api.dto.ProfileResponse;
import com.devondeck.api.entity.DeveloperProfile;
import com.devondeck.api.entity.ProfileLanguage;
import com.devondeck.api.entity.ProfileSkill;
import com.devondeck.api.exception.NotFoundException;
import com.devondeck.api.repository.DeveloperProfileRepository;
import com.devondeck.api.repository.ProfileLanguageRepository;
import com.devondeck.api.repository.ProfileSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProfileService {

    private final DeveloperProfileRepository profileRepository;
    private final ProfileLanguageRepository languageRepository;
    private final ProfileSkillRepository skillRepository;

    public ProfileService(
            DeveloperProfileRepository profileRepository,
            ProfileLanguageRepository languageRepository,
            ProfileSkillRepository skillRepository) {
        this.profileRepository = profileRepository;
        this.languageRepository = languageRepository;
        this.skillRepository = skillRepository;
    }

    // ----------------------------------------------------------------
    //  Lecture
    // ----------------------------------------------------------------

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Long id) {
        DeveloperProfile profile = findOrThrow(id);
        return toResponse(profile);
    }

    // ----------------------------------------------------------------
    //  US-10 – Biographie
    // ----------------------------------------------------------------

    @Transactional
    public ProfileResponse updateBio(Long id, String bio) {
        DeveloperProfile profile = findOrThrow(id);
        profile.setBio(bio);
        profileRepository.save(profile);
        return toResponse(profile);
    }

    // ----------------------------------------------------------------
    //  US-08 – Langages
    // ----------------------------------------------------------------

    @Transactional
    public ProfileResponse updateLanguages(Long id, List<String> languages) {
        DeveloperProfile profile = findOrThrow(id);

        if (languages == null) {
            languages = List.of();
        }

        if (languages.size() > 5) {
            throw new IllegalArgumentException("Vous ne pouvez pas ajouter plus de 5 langages.");
        }

        Set<String> seen = new HashSet<>();
        List<ProfileLanguage> newEntities = new ArrayList<>();

        for (String lang : languages) {
            if (lang == null || lang.trim().isEmpty()) {
                throw new IllegalArgumentException("Un langage ne peut pas être vide.");
            }
            String cleaned = lang.trim();
            if (!seen.add(cleaned.toLowerCase())) {
                throw new IllegalArgumentException("Doublon détecté pour le langage : " + cleaned);
            }
            newEntities.add(ProfileLanguage.builder()
                    .profileId(profile.getId())
                    .language(cleaned)
                    .build());
        }

        languageRepository.deleteByProfileId(profile.getId());
        languageRepository.saveAll(newEntities);

        return toResponse(profile);
    }

    // ----------------------------------------------------------------
    //  US-09 – Compétences / Frameworks / Bibliothèques
    // ----------------------------------------------------------------

    @Transactional
    public ProfileResponse addSkill(Long id, String name, String type) {
        DeveloperProfile profile = findOrThrow(id);

        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Le nom de la compétence est obligatoire.");
        }
        String normalizedType = type != null ? type.trim().toUpperCase() : "";
        if (!List.of("FRAMEWORK", "BIBLIOTHEQUE", "COMPETENCE").contains(normalizedType)) {
            throw new IllegalArgumentException("Le type sélectionné est invalide.");
        }

        String cleanedName = name.trim();
        List<ProfileSkill> existing = skillRepository.findByProfileId(profile.getId());
        boolean duplicate = existing.stream()
                .anyMatch(s -> s.getName().equalsIgnoreCase(cleanedName));
        if (duplicate) {
            throw new IllegalArgumentException("Cette compétence est déjà dans votre profil.");
        }

        ProfileSkill skill = ProfileSkill.builder()
                .profileId(profile.getId())
                .name(cleanedName)
                .type(normalizedType)
                .build();
        skillRepository.save(skill);

        return toResponse(profile);
    }

    @Transactional
    public void removeSkill(Long profileId, Long skillId) {
        findOrThrow(profileId);
        ProfileSkill skill = skillRepository.findByIdAndProfileId(skillId, profileId)
                .orElseThrow(() -> new NotFoundException("Compétence introuvable (id=" + skillId + ")."));
        skillRepository.delete(skill);
    }

    // ----------------------------------------------------------------
    //  Helpers internes
    // ----------------------------------------------------------------

    DeveloperProfile findOrThrow(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Profil introuvable (id=" + id + ")."));
    }

    private ProfileResponse toResponse(DeveloperProfile p) {
        List<String> langs = languageRepository.findByProfileId(p.getId()).stream()
                .map(ProfileLanguage::getLanguage)
                .toList();

        List<ProfileResponse.SkillItem> skills = skillRepository.findByProfileId(p.getId()).stream()
                .map(s -> new ProfileResponse.SkillItem(s.getId(), s.getName(), s.getType()))
                .toList();

        return new ProfileResponse(
                p.getId(),
                p.getBio(),
                langs,
                skills
        );
    }
}