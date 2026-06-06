package com.rayflow.contracts.service;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.Contract;
import com.rayflow.contracts.entity.ContractStatus;
import com.rayflow.contracts.entity.WorkflowHistory;
import com.rayflow.contracts.exception.ResourceNotFoundException;
import com.rayflow.contracts.repository.ContractRepository;
import com.rayflow.contracts.repository.WorkflowHistoryRepository;
import com.rayflow.contracts.service.impl.ContractServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContractServiceTest {

    @Mock
    private ContractRepository contractRepository;

    @Mock
    private WorkflowHistoryRepository workflowHistoryRepository;

    @InjectMocks
    private ContractServiceImpl contractService;

    private Contract mockContract;
    private UUID contractId;

    @BeforeEach
    void setUp() {
        contractId = UUID.randomUUID();
        mockContract = Contract.builder()
                .id(contractId)
                .title("Acme NDA")
                .description("Mutual Non Disclosure Agreement")
                .status(ContractStatus.DRAFT)
                .ownerName("Alice Vance")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    void getContractById_Success() {
        when(contractRepository.findById(contractId)).thenReturn(Optional.of(mockContract));

        ContractResponse result = contractService.getContractById(contractId);

        assertThat(result).isNotNull();
        assertThat(result.id()).isEqualTo(contractId);
        assertThat(result.title()).isEqualTo("Acme NDA");
        verify(contractRepository, times(1)).findById(contractId);
    }

    @Test
    void getContractById_NotFound_ThrowsException() {
        when(contractRepository.findById(contractId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contractService.getContractById(contractId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Contract not found");
        
        verify(contractRepository, times(1)).findById(contractId);
    }

    @Test
    void getContracts_CallsRepository() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Contract> page = new PageImpl<>(List.of(mockContract));
        when(contractRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        Page<ContractResponse> result = contractService.getContracts("Acme", null, null, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).title()).isEqualTo("Acme NDA");
    }

    @Test
    void getContractHistory_Success() {
        WorkflowHistory history = WorkflowHistory.builder()
                .id(UUID.randomUUID())
                .contract(mockContract)
                .previousStatus(null)
                .newStatus(ContractStatus.DRAFT)
                .changedBy("Alice Vance")
                .changedAt(Instant.now())
                .build();

        when(contractRepository.existsById(contractId)).thenReturn(true);
        when(workflowHistoryRepository.findByContractIdOrderByChangedAtDesc(contractId)).thenReturn(List.of(history));

        List<WorkflowHistoryResponse> result = contractService.getContractHistory(contractId);

        assertThat(result).isNotEmpty();
        assertThat(result.get(0).newStatus()).isEqualTo(ContractStatus.DRAFT);
        verify(contractRepository, times(1)).existsById(contractId);
        verify(workflowHistoryRepository, times(1)).findByContractIdOrderByChangedAtDesc(contractId);
    }

    @Test
    void getContractHistory_ContractNotFound_ThrowsException() {
        when(contractRepository.existsById(contractId)).thenReturn(false);

        assertThatThrownBy(() -> contractService.getContractHistory(contractId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Contract not found");

        verify(contractRepository, times(1)).existsById(contractId);
        verify(workflowHistoryRepository, never()).findByContractIdOrderByChangedAtDesc(any());
    }
}
