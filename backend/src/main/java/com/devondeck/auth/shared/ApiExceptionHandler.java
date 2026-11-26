package com.devondeck.auth.shared;

import com.devondeck.auth.shared.ApiExceptions.Conflict;
import com.devondeck.auth.shared.ApiExceptions.InvalidInput;
import com.devondeck.auth.shared.ApiExceptions.InvalidCredentials;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(InvalidCredentials.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentials exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(Conflict.class)
    public ResponseEntity<Map<String, String>> handleConflict(Conflict exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(InvalidInput.class)
    public ResponseEntity<Map<String, String>> handleInvalidInput(InvalidInput exception) {
        return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> "Le champ « " + error.getField() + " » est invalide.")
                .orElse("Les informations saisies sont invalides.");
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }
}
