package com.rayflow.contracts.service.impl;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.Contract;
import com.rayflow.contracts.entity.ContractStatus;
import com.rayflow.contracts.exception.ResourceNotFoundException;
import com.rayflow.contracts.mapper.ContractMapper;
import com.rayflow.contracts.repository.ContractRepository;
import com.rayflow.contracts.repository.WorkflowHistoryRepository;
import com.rayflow.contracts.repository.specification.ContractSpecification;
import com.rayflow.contracts.service.ContractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ContractServiceImpl implements ContractService {

    private final ContractRepository contractRepository;
    private final WorkflowHistoryRepository workflowHistoryRepository;

    @Override
    public Page<ContractResponse> getContracts(String title, String ownerName, ContractStatus status, Pageable pageable) {
        log.info("Fetching contracts page with filters - title: '{}', owner: '{}', status: '{}' (page: {}, size: {})", 
                title, ownerName, status, pageable.getPageNumber(), pageable.getPageSize());
        
        Specification<Contract> spec = Specification.where(ContractSpecification.hasTitleLike(title))
                .and(ContractSpecification.hasOwnerLike(ownerName))
                .and(ContractSpecification.hasStatus(status));

        return contractRepository.findAll(spec, pageable)
                .map(ContractMapper::toContractResponse);
    }

    @Override
    public ContractResponse getContractById(UUID id) {
        log.info("Fetching contract details for ID: {}", id);
        return contractRepository.findById(id)
                .map(ContractMapper::toContractResponse)
                .orElseThrow(() -> {
                    log.warn("Contract details lookup failed - ID {} not found", id);
                    return new ResourceNotFoundException("Contract not found with ID: " + id);
                });
    }

    @Override
    public List<WorkflowHistoryResponse> getContractHistory(UUID id) {
        log.info("Fetching workflow history for contract ID: {}", id);
        if (!contractRepository.existsById(id)) {
            log.warn("Contract history lookup failed - contract ID {} not found", id);
            throw new ResourceNotFoundException("Contract not found with ID: " + id);
        }

        return workflowHistoryRepository.findByContractIdOrderByChangedAtDesc(id).stream()
                .map(ContractMapper::toWorkflowHistoryResponse)
                .toList();
    }
}
