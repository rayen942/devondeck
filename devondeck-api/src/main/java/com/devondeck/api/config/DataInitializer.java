package com.devondeck.api.config;

import com.devondeck.api.entity.DeveloperProfile;
import com.devondeck.api.repository.DeveloperProfileRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Initialise un profil développeur par défaut (ID = 1) au démarrage
 * s'il n'existe aucun profil dans la base de données.
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDefaultProfile(DeveloperProfileRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                DeveloperProfile defaultProfile = DeveloperProfile.builder()
                        .bio("Développeur passionné par le web et les nouvelles technologies.")
                        .build();
                repository.save(defaultProfile);
                System.out.println("✅ Profil initial créé avec succès (ID = 1)");
            }
        };
    }
}