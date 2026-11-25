package com.devondeck.auth.shared;

public final class ApiExceptions {
    private ApiExceptions() {
    }

    public static class InvalidCredentials extends RuntimeException {
        public InvalidCredentials(String message) {
            super(message);
        }
    }

    public static class InvalidInput extends RuntimeException {
        public InvalidInput(String message) {
            super(message);
        }
    }

    public static class Conflict extends RuntimeException {
        public Conflict(String message) {
            super(message);
        }
    }
}
