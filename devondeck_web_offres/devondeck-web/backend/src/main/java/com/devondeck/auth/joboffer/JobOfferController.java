package com.devondeck.auth.joboffer;

import com.devondeck.auth.security.JwtPrincipal;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Accès réservé au rôle ORGANISATION (voir SecurityConfiguration : /api/organisation/**). */
@RestController
@RequestMapping("/api/organisation/offres")
public class JobOfferController {
    private final JobOfferService offerService;

    public JobOfferController(JobOfferService offerService) {
        this.offerService = offerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobOfferService.JobOfferResponse create(@AuthenticationPrincipal JwtPrincipal principal,
                                                   @Valid @RequestBody JobOfferRequests.Create request) {
        return offerService.create(principal.id(), request);
    }

    @GetMapping
    public List<JobOfferService.JobOfferResponse> list(@AuthenticationPrincipal JwtPrincipal principal) {
        return offerService.listForOrganization(principal.id());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal JwtPrincipal principal, @PathVariable Long id) {
        offerService.delete(principal.id(), id);
    }
}
