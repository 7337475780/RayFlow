package com.rayflow.contracts.dto;

import com.rayflow.contracts.entity.ContractStatus;
import java.time.Instant;
import java.util.UUID;

public record WorkflowHistoryResponse(
    UUID id,
    UUID contractId,
    ContractStatus previousStatus,
    ContractStatus newStatus,
    String changedBy,
    Instant changedAt
) {}
