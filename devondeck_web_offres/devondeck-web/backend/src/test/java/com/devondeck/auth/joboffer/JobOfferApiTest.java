package com.devondeck.auth.joboffer;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.devondeck.auth.organization.Organization;
import com.devondeck.auth.organization.OrganizationRepository;
import com.devondeck.auth.shared.JwtService;
import com.devondeck.auth.shared.RevokedTokenRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:offers-test;DB_CLOSE_DELAY=-1",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "app.jwt.secret=test-secret-for-jwt-signing-at-least-32-bytes"
})
@AutoConfigureMockMvc
class JobOfferApiTest {
    private static final String OFFER_JSON = """
            {
              "title": "  Développeur Java  ",
              "description": "Rejoignez notre équipe backend.",
              "skills": ["Java", " Spring Boot ", "java"]
            }
            """;

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private OrganizationRepository organizations;
    @Autowired private JobOfferRepository offers;
    @Autowired private RevokedTokenRepository revokedTokens;
    @Autowired private JwtService jwtService;

    private Organization acme;
    private Organization globex;

    @BeforeEach
    void setUp() {
        offers.deleteAll();
        organizations.deleteAll();
        revokedTokens.deleteAll();
        acme = organizations.save(new Organization("Acme", "Tech", "Paris", null, "a@acme.example", "x"));
        globex = organizations.save(new Organization("Globex", "Tech", "Lyon", null, "g@globex.example", "x"));
    }

    private String bearer(Organization organization) {
        return "Bearer " + jwtService.createToken(
                organization.getId(), organization.getEmail(), "ORGANISATION").value();
    }

    private long createOffer(Organization organization) throws Exception {
        String body = mockMvc.perform(post("/api/organisation/offres")
                        .header(HttpHeaders.AUTHORIZATION, bearer(organization))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(OFFER_JSON))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return objectMapper.readTree(body).get("id").asLong();
    }

    // US-12
    @Test
    void publishesOfferWithTitleDescriptionAndDeduplicatedSkills() throws Exception {
        mockMvc.perform(post("/api/organisation/offres")
                        .header(HttpHeaders.AUTHORIZATION, bearer(acme))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(OFFER_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.title").value("Développeur Java"))
                .andExpect(jsonPath("$.description").value("Rejoignez notre équipe backend."))
                .andExpect(jsonPath("$.skills.length()").value(2))
                .andExpect(jsonPath("$.skills[0]").value("Java"))
                .andExpect(jsonPath("$.skills[1]").value("Spring Boot"));
    }

    @Test
    void rejectsInvalidOffers() throws Exception {
        String[] invalidBodies = {
                """
                {"title":"","description":"d","skills":["Java"]}""",
                """
                {"title":"t","description":"  ","skills":["Java"]}""",
                """
                {"title":"t","description":"d","skills":[]}""",
                """
                {"title":"t","description":"d","skills":["  "]}""",
        };
        for (String body : invalidBodies) {
            mockMvc.perform(post("/api/organisation/offres")
                            .header(HttpHeaders.AUTHORIZATION, bearer(acme))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest());
        }
    }

    // US-13
    @Test
    void listsOnlyOffersOfTheAuthenticatedOrganizationNewestFirst() throws Exception {
        long first = createOffer(acme);
        long second = createOffer(acme);
        createOffer(globex);

        mockMvc.perform(get("/api/organisation/offres").header(HttpHeaders.AUTHORIZATION, bearer(acme)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(second))
                .andExpect(jsonPath("$[1].id").value(first));
    }

    @Test
    void listIsEmptyWhenOrganizationHasNoOffer() throws Exception {
        mockMvc.perform(get("/api/organisation/offres").header(HttpHeaders.AUTHORIZATION, bearer(acme)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    // US-14
    @Test
    void deletesOwnOffer() throws Exception {
        long id = createOffer(acme);

        mockMvc.perform(delete("/api/organisation/offres/" + id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(acme)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/organisation/offres").header(HttpHeaders.AUTHORIZATION, bearer(acme)))
                .andExpect(jsonPath("$.length()").value(0));
        mockMvc.perform(delete("/api/organisation/offres/" + id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(acme)))
                .andExpect(status().isNotFound());
    }

    @Test
    void cannotDeleteAnotherOrganizationsOffer() throws Exception {
        long id = createOffer(acme);

        mockMvc.perform(delete("/api/organisation/offres/" + id)
                        .header(HttpHeaders.AUTHORIZATION, bearer(globex)))
                .andExpect(status().isNotFound());

        org.junit.jupiter.api.Assertions.assertTrue(offers.findById(id).isPresent());
    }

    // Sécurité
    @Test
    void requiresOrganisationRole() throws Exception {
        mockMvc.perform(get("/api/organisation/offres")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/organisation/offres")
                        .contentType(MediaType.APPLICATION_JSON).content(OFFER_JSON))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/api/organisation/offres/1")).andExpect(status().isUnauthorized());

        String developerToken = "Bearer " + jwtService.createToken(1L, "dev@example.com", "DEVELOPPEUR").value();
        mockMvc.perform(get("/api/organisation/offres").header(HttpHeaders.AUTHORIZATION, developerToken))
                .andExpect(status().isForbidden());
    }
}
