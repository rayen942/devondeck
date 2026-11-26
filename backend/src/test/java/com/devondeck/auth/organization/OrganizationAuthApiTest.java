package com.devondeck.auth.organization;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.devondeck.auth.shared.JwtService;
import com.devondeck.auth.shared.RevokedTokenRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:auth-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.jwt.secret=test-secret-for-jwt-signing-at-least-32-bytes"
})
@AutoConfigureMockMvc
class OrganizationAuthApiTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private OrganizationRepository organizations;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RevokedTokenRepository revokedTokens;

    @BeforeEach
    void clearOrganizations() {
        organizations.deleteAll();
        revokedTokens.deleteAll();
    }

    @Test
    void registersOrganizationAndAuthenticatesWithItsPassword() throws Exception {
        mockMvc.perform(post("/api/auth/organisation/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "raisonSociale": "Acme",
                                  "secteur": "Tech",
                                  "ville": "Paris",
                                  "siteWeb": "https://acme.example",
                                  "email": "CONTACT@acme.example",
                                  "password": "Secret123!"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("ORGANISATION"))
                .andExpect(jsonPath("$.email").value("contact@acme.example"));

        Organization organization = organizations.findByEmailIgnoreCase("contact@acme.example").orElseThrow();
        org.junit.jupiter.api.Assertions.assertNotEquals("Secret123!", organization.getPasswordHash());
        org.junit.jupiter.api.Assertions.assertTrue(passwordEncoder.matches(
                "Secret123!", organization.getPasswordHash()));

        mockMvc.perform(post("/api/auth/organisation/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"contact@acme.example","password":"Secret123!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", startsWith("eyJ")))
                .andExpect(jsonPath("$.role").value("ORGANISATION"));
    }

    @Test
    void rejectsIncorrectCredentialsAndInvalidInput() throws Exception {
        organizations.save(new Organization(
                "Acme", "Tech", "Paris", null, "contact@acme.example",
                passwordEncoder.encode("Secret123!")
        ));

        mockMvc.perform(post("/api/auth/organisation/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"contact@acme.example","password":"wrong"}
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("E-mail ou mot de passe incorrect."));

        mockMvc.perform(post("/api/auth/organisation/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new OrganizationAuthRequests.Login("invalid-email", ""))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(startsWith("Le champ")));

        mockMvc.perform(post("/api/auth/organisation/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new OrganizationAuthRequests.Login("contact@acme.example", "a".repeat(73)))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Le mot de passe ne doit pas dépasser 72 octets."));
    }

    @Test
    void rejectsDuplicateOrganizationEmail() throws Exception {
        organizations.save(new Organization(
                "Acme", "Tech", "Paris", null, "contact@acme.example",
                passwordEncoder.encode("Secret123!")
        ));

        mockMvc.perform(post("/api/auth/organisation/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "raisonSociale": "Another Acme",
                                  "secteur": "Tech",
                                  "ville": "Lyon",
                                  "email": "CONTACT@acme.example",
                                  "password": "Secret123!"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Une organisation utilise déjà cette adresse e-mail."));
    }

    @Test
    void includesUserIdAndRoleInTokenAndAllowsOrganizationRoute() throws Exception {
        Organization organization = organizations.save(new Organization(
                "Acme", "Tech", "Paris", null, "contact@acme.example",
                passwordEncoder.encode("Secret123!")
        ));

        String token = mockMvc.perform(post("/api/auth/organisation/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"contact@acme.example","password":"Secret123!"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(organization.getId()))
                .andExpect(jsonPath("$.role").value("ORGANISATION"))
                .andReturn()
                .getResponse()
                .getContentAsString();
        String jwt = objectMapper.readTree(token).get("token").asText();

        org.junit.jupiter.api.Assertions.assertEquals(
                organization.getId().toString(), jwtService.parseToken(jwt).getSubject());
        org.junit.jupiter.api.Assertions.assertEquals(
                "ORGANISATION", jwtService.parseToken(jwt).get("role", String.class));

        mockMvc.perform(get("/api/organisation/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + jwt))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(organization.getId()))
                .andExpect(jsonPath("$.email").value("contact@acme.example"))
                .andExpect(jsonPath("$.role").value("ORGANISATION"));
    }

    @Test
    void rejectsMissingInvalidExpiredAndWrongRoleTokens() throws Exception {
        Organization organization = organizations.save(new Organization(
                "Acme", "Tech", "Paris", null, "contact@acme.example",
                passwordEncoder.encode("Secret123!")
        ));
        String expiredToken = Jwts.builder()
                .subject(organization.getId().toString())
                .claim("email", organization.getEmail())
                .claim("role", "ORGANISATION")
                .issuedAt(Date.from(Instant.now().minusSeconds(120)))
                .expiration(Date.from(Instant.now().minusSeconds(60)))
                .signWith(Keys.hmacShaKeyFor(
                        "test-secret-for-jwt-signing-at-least-32-bytes".getBytes(StandardCharsets.UTF_8)))
                .compact();

        mockMvc.perform(get("/api/organisation/session"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/organisation/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer invalid.token.value"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/organisation/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());

        String developerToken = jwtService.createToken(
                organization.getId(), organization.getEmail(), "DEVELOPPEUR").value();
        mockMvc.perform(get("/api/organisation/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + developerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void logoutRevokesTokenAndProtectedRoutesRejectIt() throws Exception {
        organizations.save(new Organization(
                "Acme", "Tech", "Paris", null, "contact@acme.example",
                passwordEncoder.encode("Secret123!")
        ));
        String response = mockMvc.perform(post("/api/auth/organisation/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"email":"contact@acme.example","password":"Secret123!"}
                                """))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();
        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(get("/api/organisation/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/logout")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/organisation/session")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isUnauthorized());
    }
}
