package com.devondeck.api.exception;

import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Intercepte toutes les exceptions et renvoie { "message": "..." }
 * avec le code HTTP approprié.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 404 – profil introuvable */
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(NotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }

    /** 400 – données invalides (Bean Validation) */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getDefaultMessage())
                .findFirst()
                .orElse("Données invalides.");
        return ResponseEntity.badRequest()
                .body(Map.of("message", msg));
    }

    /** 400 – erreurs métier (doublon, max dépassé…) */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", ex.getMessage()));
    }
}
