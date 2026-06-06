package com.rayflow.contracts.controller;

import com.rayflow.contracts.dto.ContractResponse;
import com.rayflow.contracts.dto.WorkflowHistoryResponse;
import com.rayflow.contracts.entity.ContractStatus;
import com.rayflow.contracts.exception.ResourceNotFoundException;
import com.rayflow.contracts.service.ContractService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContractController.class)
class ContractControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContractService contractService;

    @Test
    void getContracts_ReturnsOkAndJson() throws Exception {
        UUID id = UUID.randomUUID();
        ContractResponse response = new ContractResponse(
                id, "Lease Agreement", "Office Space", ContractStatus.APPROVED, "Bob Smith", Instant.now(), Instant.now()
        );

        PageImpl<ContractResponse> page = new PageImpl<>(List.of(response));
        when(contractService.getContracts(any(), any(), any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/contracts")
                        .param("title", "Lease")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(id.toString()))
                .andExpect(jsonPath("$.content[0].title").value("Lease Agreement"))
                .andExpect(jsonPath("$.content[0].status").value("APPROVED"));
    }

    @Test
    void getContractById_Success() throws Exception {
        UUID id = UUID.randomUUID();
        ContractResponse response = new ContractResponse(
                id, "NDA Acme", "NDA Description", ContractStatus.DRAFT, "Alice", Instant.now(), Instant.now()
        );

        when(contractService.getContractById(id)).thenReturn(response);

        mockMvc.perform(get("/api/contracts/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.title").value("NDA Acme"));
    }

    @Test
    void getContractById_NotFound_Returns404() throws Exception {
        UUID id = UUID.randomUUID();
        when(contractService.getContractById(id)).thenThrow(new ResourceNotFoundException("Contract not found"));

        mockMvc.perform(get("/api/contracts/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Contract not found"));
    }

    @Test
    void getContractHistory_Success() throws Exception {
        UUID id = UUID.randomUUID();
        WorkflowHistoryResponse history = new WorkflowHistoryResponse(
                UUID.randomUUID(), id, null, ContractStatus.DRAFT, "Alice", Instant.now()
        );

        when(contractService.getContractHistory(id)).thenReturn(List.of(history));

        mockMvc.perform(get("/api/contracts/{id}/history", id)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].contractId").value(id.toString()))
                .andExpect(jsonPath("$[0].newStatus").value("DRAFT"));
    }
}
