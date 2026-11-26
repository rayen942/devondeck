package com.devondeck.api.entity;

import jakarta.persistence.*;

/**
 * Entité représentant un des 5 langages principaux du profil (US-08).
 * Table : profile_language
 */
@Entity
@Table(name = "profile_language")
public class ProfileLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(nullable = false, length = 50)
    private String language;

    public ProfileLanguage() {
    }

    public ProfileLanguage(Long id, Long profileId, String language) {
        this.id = id;
        this.profileId = profileId;
        this.language = language;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public static ProfileLanguageBuilder builder() {
        return new ProfileLanguageBuilder();
    }

    public static class ProfileLanguageBuilder {
        private Long id;
        private Long profileId;
        private String language;

        ProfileLanguageBuilder() {
        }

        public ProfileLanguageBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProfileLanguageBuilder profileId(Long profileId) {
            this.profileId = profileId;
            return this;
        }

        public ProfileLanguageBuilder language(String language) {
            this.language = language;
            return this;
        }

        public ProfileLanguage build() {
            return new ProfileLanguage(id, profileId, language);
        }
    }
}
