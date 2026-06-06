package com.rayflow.contracts.repository;

import com.rayflow.contracts.entity.WorkflowHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WorkflowHistoryRepository extends JpaRepository<WorkflowHistory, UUID> {
    
    // Fetch workflow history sorted with newest transitions first
    List<WorkflowHistory> findByContractIdOrderByChangedAtDesc(UUID contractId);
}
