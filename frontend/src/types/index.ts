export type ContractStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXPIRED' | 'TERMINATED';

export interface Contract {
  id: string;
  title: string;
  description: string;
  status: ContractStatus;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowHistory {
  id: string;
  contractId: string;
  previousStatus: ContractStatus | null;
  newStatus: ContractStatus;
  changedBy: string;
  changedAt: string;
}

// Maps directly to the PageImpl payload returned by Spring Data JPA
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ContractFilters {
  title?: string;
  owner?: string;
  status?: ContractStatus | '';
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}
