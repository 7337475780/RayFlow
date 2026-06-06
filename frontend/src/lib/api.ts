import { Contract, ContractFilters, PaginatedResponse, WorkflowHistory } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiException extends Error {
  status: number;
  error: string;
  validationErrors?: { field: string; message: string }[];

  constructor(status: number, error: string, message: string, validationErrors?: { field: string; message: string }[]) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.error = error;
    this.validationErrors = validationErrors;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorBody;
    try {
      errorBody = await response.json();
    } catch {
      throw new ApiException(
        response.status,
        response.statusText,
        'An unexpected server error occurred'
      );
    }
    
    throw new ApiException(
      errorBody.status || response.status,
      errorBody.error || response.statusText,
      errorBody.message || 'An error occurred during request processing',
      errorBody.validationErrors
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Fetch contracts page from Spring Boot backend using dynamic query filters
  getContracts: async (filters: ContractFilters = {}): Promise<PaginatedResponse<Contract>> => {
    const params = new URLSearchParams();
    
    if (filters.title) params.append('title', filters.title);
    if (filters.owner) params.append('owner', filters.owner);
    if (filters.status) params.append('status', filters.status);
    
    params.append('page', (filters.page !== undefined ? filters.page : 0).toString());
    params.append('size', (filters.size !== undefined ? filters.size : 10).toString());
    params.append('sortBy', filters.sortBy || 'createdAt');
    params.append('sortDir', filters.sortDir || 'desc');

    return fetchJson<PaginatedResponse<Contract>>(`${API_BASE_URL}/api/v1/contracts?${params.toString()}`, {
      cache: 'no-store', // Ensures server components bypass caches to fetch real-time state from DB
    });
  },

  // Fetch detailed contract metadata by UUID
  getContractById: async (id: string): Promise<Contract> => {
    return fetchJson<Contract>(`${API_BASE_URL}/api/v1/contracts/${id}`, {
      cache: 'no-store',
    });
  },

  // Fetch sorted change event histories for a specific contract
  getContractHistory: async (id: string): Promise<WorkflowHistory[]> => {
    return fetchJson<WorkflowHistory[]>(`${API_BASE_URL}/api/v1/contracts/${id}/history`, {
      cache: 'no-store',
    });
  },
};
