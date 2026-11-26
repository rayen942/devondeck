package com.devondeck.auth.organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "organizations")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String raisonSociale;

    @Column(nullable = false)
    private String secteur;

    @Column(nullable = false)
    private String ville;

    
    private String siteWeb;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    protected Organization() {
    }

    public Organization(String raisonSociale, String secteur, String ville, String siteWeb,
                        String email, String passwordHash) {
        this.raisonSociale = raisonSociale;
        this.secteur = secteur;
        this.ville = ville;
        this.siteWeb = siteWeb;
        this.email = email;
        this.passwordHash = passwordHash;
    }
    

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }
    public String getRaisonSociale() { return raisonSociale; }
    public String getSecteur() { return secteur; }
    public String getVille() { return ville; }
    public String getSiteWeb() { return siteWeb; }
}
