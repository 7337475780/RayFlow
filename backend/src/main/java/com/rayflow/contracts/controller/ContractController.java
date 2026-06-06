package com.rayflow.contracts.controller;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.ContractStatus;
import com.rayflow.contracts.service.ContractService;
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
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
@Validated
@CrossOrigin(origins = "*") // Allows API consumption by the Next.js frontend
public class ContractController {

    private final ContractService contractService;

    // Whitelist of valid sorting fields to prevent database query failures
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "title", "status", "ownerName", "createdAt", "updatedAt"
    );

    @GetMapping
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
    public ResponseEntity<ContractResponse> getContractById(@PathVariable UUID id) {
        ContractResponse contract = contractService.getContractById(id);
        return ResponseEntity.ok(contract);
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<List<WorkflowHistoryResponse>> getContractHistory(@PathVariable UUID id) {
        List<WorkflowHistoryResponse> history = contractService.getContractHistory(id);
        return ResponseEntity.ok(history);
    }
}
