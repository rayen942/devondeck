package com.devondeck.auth.joboffer;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {
    List<JobOffer> findByOrganizationIdOrderByCreatedAtDescIdDesc(Long organizationId);

    Optional<JobOffer> findByIdAndOrganizationId(Long id, Long organizationId);
}
