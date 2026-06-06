package com.rayflow.contracts.mapper;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.Contract;
import com.rayflow.contracts.entity.WorkflowHistory;

public final class ContractMapper {

    private ContractMapper() {
        // Prevent instantiation of utility class
    }

    public static ContractResponse toContractResponse(Contract contract) {
        if (contract == null) {
            return null;
        }
        return new ContractResponse(
            contract.getId(),
            contract.getTitle(),
            contract.getDescription(),
            contract.getStatus(),
            contract.getOwnerName(),
            contract.getCreatedAt(),
            contract.getUpdatedAt()
        );
    }

    public static WorkflowHistoryResponse toWorkflowHistoryResponse(WorkflowHistory history) {
        if (history == null) {
            return null;
        }
        return new WorkflowHistoryResponse(
            history.getId(),
            history.getContract().getId(),
            history.getPreviousStatus(),
            history.getNewStatus(),
            history.getChangedBy(),
            history.getChangedAt()
        );
    }
}
