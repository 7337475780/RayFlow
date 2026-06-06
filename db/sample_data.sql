TRUNCATE TABLE workflow_history CASCADE;
TRUNCATE TABLE contracts CASCADE;

-- Contracts seed data
INSERT INTO contracts (id, title, description, status, owner_name, created_at, updated_at) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
 'Standard Mutual NDA - Acme Corp', 
 'Mutual non-disclosure agreement with Acme Corporation regarding upcoming project discussions.', 
 'DRAFT', 
 'Alice Vance', 
 NOW() - INTERVAL '10 days', 
 NOW() - INTERVAL '10 days'),

('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 
 'Enterprise SaaS Subscription Agreement - Globex Corp', 
 'Multi-year enterprise contract for SaaS licensing and support level agreements.', 
 'PENDING_APPROVAL', 
 'Bob Smith', 
 NOW() - INTERVAL '15 days', 
 NOW() - INTERVAL '5 days'),

('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 
 'Commercial Office Lease - Seattle Headquarters', 
 'Lease agreement for the 4th floor of the downtown office complex.', 
 'APPROVED', 
 'Charlie Brown', 
 NOW() - INTERVAL '30 days', 
 NOW() - INTERVAL '20 days'),

('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 
 'Professional Services Agreement - Delta Consulting Group', 
 'Statement of work for software development resources and cloud consulting services.', 
 'REJECTED', 
 'Diana Prince', 
 NOW() - INTERVAL '5 days', 
 NOW() - INTERVAL '2 days'),

('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 
 'Hardware Procurement Agreement - Echo Tech', 
 'Contract for purchasing office laptops, monitors, and network switches.', 
 'EXPIRED', 
 'Evan Wright', 
 NOW() - INTERVAL '365 days', 
 NOW() - INTERVAL '180 days'),

('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 
 'Joint Marketing Agreement - Foxtrot Ventures', 
 'Strategic co-marketing and event partnership agreement.', 
 'TERMINATED', 
 'Fiona Gallagher', 
 NOW() - INTERVAL '90 days', 
 NOW() - INTERVAL '30 days');

-- Workflow history audit trail seed data
INSERT INTO workflow_history (id, contract_id, previous_status, new_status, changed_by, changed_at) VALUES
-- Acme NDA history
(uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NULL, 'DRAFT', 'Alice Vance', NOW() - INTERVAL '10 days'),

-- Globex SaaS history
(uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', NULL, 'DRAFT', 'Bob Smith', NOW() - INTERVAL '15 days'),
(uuid_generate_v4(), 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'DRAFT', 'PENDING_APPROVAL', 'Bob Smith', NOW() - INTERVAL '5 days'),

-- Seattle Lease history
(uuid_generate_v4(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NULL, 'DRAFT', 'Charlie Brown', NOW() - INTERVAL '30 days'),
(uuid_generate_v4(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'DRAFT', 'PENDING_APPROVAL', 'Charlie Brown', NOW() - INTERVAL '25 days'),
(uuid_generate_v4(), 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'PENDING_APPROVAL', 'APPROVED', 'Legal Officer Sarah', NOW() - INTERVAL '20 days'),

-- Delta Consulting history
(uuid_generate_v4(), 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', NULL, 'DRAFT', 'Diana Prince', NOW() - INTERVAL '5 days'),
(uuid_generate_v4(), 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'DRAFT', 'PENDING_APPROVAL', 'Diana Prince', NOW() - INTERVAL '4 days'),
(uuid_generate_v4(), 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'PENDING_APPROVAL', 'REJECTED', 'Finance Director Mark', NOW() - INTERVAL '2 days'),

-- Echo Tech history
(uuid_generate_v4(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', NULL, 'DRAFT', 'Evan Wright', NOW() - INTERVAL '365 days'),
(uuid_generate_v4(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'DRAFT', 'PENDING_APPROVAL', 'Evan Wright', NOW() - INTERVAL '360 days'),
(uuid_generate_v4(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'PENDING_APPROVAL', 'APPROVED', 'Legal Officer Sarah', NOW() - INTERVAL '350 days'),
(uuid_generate_v4(), 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'APPROVED', 'EXPIRED', 'System Daemon', NOW() - INTERVAL '180 days'),

-- Foxtrot Ventures history
(uuid_generate_v4(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', NULL, 'DRAFT', 'Fiona Gallagher', NOW() - INTERVAL '90 days'),
(uuid_generate_v4(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'DRAFT', 'PENDING_APPROVAL', 'Fiona Gallagher', NOW() - INTERVAL '85 days'),
(uuid_generate_v4(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'PENDING_APPROVAL', 'APPROVED', 'Legal Officer Sarah', NOW() - INTERVAL '80 days'),
(uuid_generate_v4(), 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'APPROVED', 'TERMINATED', 'VP Sales John', NOW() - INTERVAL '30 days');
