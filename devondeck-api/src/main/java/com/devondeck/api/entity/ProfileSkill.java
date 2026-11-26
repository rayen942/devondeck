package com.devondeck.api.entity;

import jakarta.persistence.*;

/**
 * Entité représentant une compétence, un framework ou une bibliothèque (US-09).
 * Table : profile_skill
 */
@Entity
@Table(name = "profile_skill")
public class ProfileSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "profile_id", nullable = false)
    private Long profileId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String type; // FRAMEWORK, BIBLIOTHEQUE, COMPETENCE

    public ProfileSkill() {
    }

    public ProfileSkill(Long id, Long profileId, String name, String type) {
        this.id = id;
        this.profileId = profileId;
        this.name = name;
        this.type = type;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public static ProfileSkillBuilder builder() {
        return new ProfileSkillBuilder();
    }

    public static class ProfileSkillBuilder {
        private Long id;
        private Long profileId;
        private String name;
        private String type;

        ProfileSkillBuilder() {}

        public ProfileSkillBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProfileSkillBuilder profileId(Long profileId) {
            this.profileId = profileId;
            return this;
        }

        public ProfileSkillBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProfileSkillBuilder type(String type) {
            this.type = type;
            return this;
        }

        public ProfileSkill build() {
            return new ProfileSkill(id, profileId, name, type);
        }
    }
}