package com.devondeck.profile;

import jakarta.validation.Valid;
import java.time.Instant;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/developpeurs/profil")
@CrossOrigin(origins = "http://localhost:5173")
public class DeveloperProfileController {
  private final DeveloperProfileRepository repository;
  public DeveloperProfileController(DeveloperProfileRepository repository) { this.repository = repository; }

  @GetMapping
  public ResponseEntity<DeveloperProfile> get(@RequestHeader("X-Account-Id") Long accountId) {
    return repository.findByAccountId(accountId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<DeveloperProfile> create(@RequestHeader("X-Account-Id") Long accountId, @Valid @RequestBody DeveloperProfile request) {
    if (repository.findByAccountId(accountId).isPresent()) throw new ResponseStatusException(HttpStatus.CONFLICT, "Un profil existe déjà pour ce compte.");
    request.setAccountId(accountId); request.setCreatedAt(Instant.now()); request.setUpdatedAt(Instant.now());
    return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(request));
  }

  @PutMapping
  public DeveloperProfile update(@RequestHeader("X-Account-Id") Long accountId, @Valid @RequestBody DeveloperProfile request) {
    DeveloperProfile current = repository.findByAccountId(accountId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profil introuvable."));
    request.setAccountId(accountId); request.setCreatedAt(current.getCreatedAt()); request.setUpdatedAt(Instant.now());
    return repository.save(request);
  }
}
