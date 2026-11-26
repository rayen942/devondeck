package com.devondeck.api.exception;

/**
 * Levée quand un profil n'existe pas → HTTP 404.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}
