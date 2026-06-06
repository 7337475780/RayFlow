package com.rayflow.contracts.repository.specification;

import com.rayflow.contracts.entity.Contract;
import com.rayflow.contracts.entity.ContractStatus;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ContractSpecification {

    // Partial case-insensitive search on title
    public static Specification<Contract> hasTitleLike(String title) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(title)) {
                return null;
            }
            return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase().trim() + "%");
        };
    }

    // Partial case-insensitive search on owner name
    public static Specification<Contract> hasOwnerLike(String ownerName) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(ownerName)) {
                return null;
            }
            return cb.like(cb.lower(root.get("ownerName")), "%" + ownerName.toLowerCase().trim() + "%");
        };
    }

    // Exact match filter on contract status
    public static Specification<Contract> hasStatus(ContractStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return null;
            }
            return cb.equal(root.get("status"), status);
        };
    }
}
