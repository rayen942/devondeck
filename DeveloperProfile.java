package com.devondeck.profile;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "developer_profiles")
public class DeveloperProfile {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(name = "account_id", nullable = false, unique = true) private Long accountId;
  @NotBlank private String email;
  @NotBlank private String prenom;
  @NotBlank private String nom;
  @NotBlank private String titre;
  @NotBlank private String ville;
  @Column(length = 2000) @NotBlank private String bio;
  @ElementCollection @CollectionTable(name = "developer_languages", joinColumns = @JoinColumn(name = "profile_id")) @Column(name = "language") private List<String> langages = new ArrayList<>();
  @Column(length = 1000) private String competences;
  @Column(length = 1000) private String frameworks;
  @Column(length = 1000) private String bibliotheques;
  private String github;
  private String linkedin;
  private String portfolio;
  private String disponibilite;
  private Instant createdAt;
  private Instant updatedAt;

  public Long getId() { return id; }
  public Long getAccountId() { return accountId; }
  public void setAccountId(Long v) { accountId = v; }
  public String getEmail() { return email; }
  public void setEmail(String v) { email = v; }
  public String getPrenom() { return prenom; }
  public void setPrenom(String v) { prenom = v; }
  public String getNom() { return nom; }
  public void setNom(String v) { nom = v; }
  public String getTitre() { return titre; }
  public void setTitre(String v) { titre = v; }
  public String getVille() { return ville; }
  public void setVille(String v) { ville = v; }
  public String getBio() { return bio; }
  public void setBio(String v) { bio = v; }
  public List<String> getLangages() { return langages; }
  public void setLangages(List<String> v) { langages = v == null ? new ArrayList<>() : v; }
  public String getCompetences() { return competences; }
  public void setCompetences(String v) { competences = v; }
  public String getFrameworks() { return frameworks; }
  public void setFrameworks(String v) { frameworks = v; }
  public String getBibliotheques() { return bibliotheques; }
  public void setBibliotheques(String v) { bibliotheques = v; }
  public String getGithub() { return github; }
  public void setGithub(String v) { github = v; }
  public String getLinkedin() { return linkedin; }
  public void setLinkedin(String v) { linkedin = v; }
  public String getPortfolio() { return portfolio; }
  public void setPortfolio(String v) { portfolio = v; }
  public String getDisponibilite() { return disponibilite; }
  public void setDisponibilite(String v) { disponibilite = v; }
  public Instant getCreatedAt() { return createdAt; }
  public void setCreatedAt(Instant v) { createdAt = v; }
  public Instant getUpdatedAt() { return updatedAt; }
  public void setUpdatedAt(Instant v) { updatedAt = v; }
}
