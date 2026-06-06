package com.rayflow.contracts.dto;

public record ValidationErrorDetail(
    String field,
    String message
) {}
