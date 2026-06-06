CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_contract_title_not_empty CHECK (char_length(trim(title)) > 0),
    CONSTRAINT chk_contract_owner_name_not_empty CHECK (char_length(trim(owner_name)) > 0),
    CONSTRAINT chk_contract_status CHECK (status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXPIRED', 'TERMINATED'))
);

CREATE TABLE workflow_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL,
    previous_status VARCHAR(50), -- null for initial draft creation
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- restrict delete to prevent losing audit history
    CONSTRAINT fk_workflow_history_contract 
        FOREIGN KEY (contract_id) 
        REFERENCES contracts (id) 
        ON DELETE RESTRICT,

    CONSTRAINT chk_history_new_status CHECK (new_status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXPIRED', 'TERMINATED')),
    CONSTRAINT chk_history_previous_status CHECK (previous_status IS NULL OR previous_status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXPIRED', 'TERMINATED')),
    CONSTRAINT chk_history_changed_by_not_empty CHECK (char_length(trim(changed_by)) > 0)
);

-- Index for filtering by status on the dashboard
CREATE INDEX idx_contracts_status ON contracts(status);

-- Case-insensitive searches on owner
CREATE INDEX idx_contracts_owner_name_lower ON contracts(lower(owner_name));

-- Trigram index for wildcard/fuzzy searches (e.g. LIKE '%term%')
CREATE INDEX idx_contracts_title_trgm ON contracts USING gin (title gin_trgm_ops);

-- Default sorting by creation date
CREATE INDEX idx_contracts_created_at_desc ON contracts(created_at DESC);

-- Speeds up fetching chronological history for a specific contract
CREATE INDEX idx_workflow_history_contract_changed ON workflow_history(contract_id, changed_at DESC);
