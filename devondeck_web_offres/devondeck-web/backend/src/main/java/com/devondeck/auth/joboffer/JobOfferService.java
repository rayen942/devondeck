package com.devondeck.auth.joboffer;

import com.devondeck.auth.shared.ApiExceptions.NotFound;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobOfferService {
    private final JobOfferRepository offers;

    public JobOfferService(JobOfferRepository offers) {
        this.offers = offers;
    }

    /** US-12 : publier une offre. */
    @Transactional
    public JobOfferResponse create(Long organizationId, JobOfferRequests.Create request) {
        JobOffer offer = offers.save(new JobOffer(
                organizationId,
                request.title().trim(),
                request.description().trim(),
                normalizeSkills(request.skills())));
        return JobOfferResponse.from(offer);
    }

    /** US-13 : lister les offres créées par l'organisation (les plus récentes d'abord). */
    @Transactional(readOnly = true)
    public List<JobOfferResponse> listForOrganization(Long organizationId) {
        return offers.findByOrganizationIdOrderByCreatedAtDescIdDesc(organizationId).stream()
                .map(JobOfferResponse::from)
                .toList();
    }

    /** US-14 : supprimer une offre. Une offre d'une autre organisation est traitée comme introuvable. */
    @Transactional
    public void delete(Long organizationId, Long offerId) {
        JobOffer offer = offers.findByIdAndOrganizationId(offerId, organizationId)
                .orElseThrow(() -> new NotFound("Cette offre est introuvable."));
        offers.delete(offer);
    }

    /** Supprime les espaces superflus et les doublons (sans tenir compte de la casse). */
    private static List<String> normalizeSkills(List<String> skills) {
        Map<String, String> unique = new LinkedHashMap<>();
        for (String skill : skills) {
            String trimmed = skill.trim();
            unique.putIfAbsent(trimmed.toLowerCase(Locale.ROOT), trimmed);
        }
        return List.copyOf(unique.values());
    }

    public record JobOfferResponse(Long id, String title, String description, List<String> skills,
                                   Instant createdAt) {
        static JobOfferResponse from(JobOffer offer) {
            return new JobOfferResponse(offer.getId(), offer.getTitle(), offer.getDescription(),
                    List.copyOf(offer.getSkills()), offer.getCreatedAt());
        }
    }
}
