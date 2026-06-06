package com.rayflow.contracts.dto;

import com.rayflow.contracts.entity.ContractStatus;
import java.time.Instant;
import java.util.UUID;

public record ContractResponse(
    UUID id,
    String title,
    String description,
    ContractStatus status,
    String ownerName,
    Instant createdAt,
    Instant updatedAt
) {}
