package com.rayflow.contracts.controller;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.ContractStatus;
import com.rayflow.contracts.service.ContractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contracts")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "${cors.allowed-origins:*}") // Restricts client domain access dynamically
@Tag(name = "Contracts", description = "Endpoints for managing contract metadata and tracking approval workflows")
public class ContractController {

    private final ContractService contractService;

    // Whitelist of valid sorting fields to prevent database query failures
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "title", "status", "ownerName", "createdAt", "updatedAt"
    );

    @GetMapping
    @Operation(
        summary = "Get paginated list of contracts", 
        description = "Retrieves a page of contracts with options to filter by title search, owner name, status, and customize sorting parameters."
    )
    public ResponseEntity<Page<ContractResponse>> getContracts(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String owner,
            @RequestParam(required = false) ContractStatus status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        // Default to createdAt if client requests sorting by an invalid field name
        String sortProperty = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";

        Sort.Direction direction = "asc".equalsIgnoreCase(sortDir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortProperty));

        Page<ContractResponse> contracts = contractService.getContracts(title, owner, status, pageable);
        return ResponseEntity.ok(contracts);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Get contract details by ID", 
        description = "Retrieves specific metadata details for a contract using its UUID. Throws 404 if the contract does not exist."
    )
    public ResponseEntity<ContractResponse> getContractById(@PathVariable UUID id) {
        ContractResponse contract = contractService.getContractById(id);
        return ResponseEntity.ok(contract);
    }

    @GetMapping("/{id}/history")
    @Operation(
        summary = "Get contract workflow history", 
        description = "Retrieves chronological workflow lifecycle transitions for a specific contract in reverse chronological order."
    )
    public ResponseEntity<List<WorkflowHistoryResponse>> getContractHistory(@PathVariable UUID id) {
        List<WorkflowHistoryResponse> history = contractService.getContractHistory(id);
        return ResponseEntity.ok(history);
    }

    @PatchMapping("/{id}/terminate")
    @Operation(
        summary = "Terminate a contract", 
        description = "Changes the contract status to TERMINATED. Requires ADMIN role passed via X-User-Role header."
    )
    public ResponseEntity<ContractResponse> terminateContract(
            @PathVariable UUID id,
            @RequestHeader(value = "X-User-Role", defaultValue = "USER") String role,
            @RequestHeader(value = "X-User-Name", defaultValue = "System") String username
    ) {
        try {
            ContractResponse response = contractService.terminateContract(id, username, role);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, e.getMessage()
            );
        }
    }
}
