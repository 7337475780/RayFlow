package com.rayflow.contracts.service;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface ContractService {
    
    // Retrieve a paginated and dynamically filtered page of contracts
    Page<ContractResponse> getContracts(String title, String ownerName, ContractStatus status, Pageable pageable);
    
    // Retrieve a single contract detail
    ContractResponse getContractById(UUID id);
    
    // Retrieve the chronological workflow history of a specific contract
    List<WorkflowHistoryResponse> getContractHistory(UUID id);
}
