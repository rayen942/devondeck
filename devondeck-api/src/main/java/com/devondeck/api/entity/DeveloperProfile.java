package com.devondeck.api.entity;

import jakarta.persistence.*;

/**
 * Profil développeur – version minimale.
 * Table : developer_profile
 */
@Entity
@Table(name = "developer_profile")
public class DeveloperProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Biographie libre, 500 caractères max (US-10). */
    @Column(length = 500)
    private String bio;

    public DeveloperProfile() {
    }

    public DeveloperProfile(Long id, String bio) {
        this.id = id;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public static DeveloperProfileBuilder builder() {
        return new DeveloperProfileBuilder();
    }

    public static class DeveloperProfileBuilder {
        private Long id;
        private String bio;

        DeveloperProfileBuilder() {
        }

        public DeveloperProfileBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public DeveloperProfileBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public DeveloperProfile build() {
            return new DeveloperProfile(id, bio);
        }
    }
}
