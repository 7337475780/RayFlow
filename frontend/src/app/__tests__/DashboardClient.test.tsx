import { render, screen } from '@testing-library/react';
import DashboardClient from '../DashboardClient';
import { PaginatedResponse, Contract } from '@/types';
import '@testing-library/jest-dom';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const mockContracts: PaginatedResponse<Contract> = {
  content: [
    {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      title: 'Mutual NDA - Acme Corp',
      description: 'Acme mutual NDA agreement details',
      status: 'DRAFT',
      ownerName: 'Alice Vance',
      createdAt: '2026-06-06T12:00:00Z',
      updatedAt: '2026-06-06T12:00:00Z',
    },
    {
      id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
      title: 'SaaS Agreement - Globex',
      description: 'Globex enterprise licensing agreement',
      status: 'APPROVED',
      ownerName: 'Bob Smith',
      createdAt: '2026-06-05T10:00:00Z',
      updatedAt: '2026-06-05T10:00:00Z',
    }
  ],
  totalPages: 1,
  totalElements: 2,
  size: 10,
  number: 0,
  numberOfElements: 2,
  first: true,
  last: true,
  empty: false,
};

const emptyContracts: PaginatedResponse<Contract> = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  size: 10,
  number: 0,
  numberOfElements: 0,
  first: true,
  last: true,
  empty: true,
};

describe('DashboardClient Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders contract details, titles, and owners correctly', () => {
    render(<DashboardClient initialContracts={mockContracts} initialFilters={{}} />);
    
    expect(screen.getByText('Mutual NDA - Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('SaaS Agreement - Globex')).toBeInTheDocument();
    expect(screen.getByText('Alice Vance')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  it('renders status badges with correct text representation', () => {
    render(<DashboardClient initialContracts={mockContracts} initialFilters={{}} />);
    
    expect(screen.getByText('DRAFT')).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
  });

  it('displays empty state search illustration when contracts are empty', () => {
    render(<DashboardClient initialContracts={emptyContracts} initialFilters={{}} />);
    
    expect(screen.getByText('No Contracts Available')).toBeInTheDocument();
    expect(screen.getByText("We couldn't find matching records for your current parameters. Try clearing your filter queries.")).toBeInTheDocument();
  });

  it('binds inputs to search filters title and owner fields', () => {
    render(<DashboardClient initialContracts={mockContracts} initialFilters={{ title: 'Mutual', owner: 'Alice' }} />);
    
    const titleInput = screen.getByPlaceholderText('Search NDA, Lease, SOW...') as HTMLInputElement;
    const ownerInput = screen.getByPlaceholderText('Search Alice, Bob, Sarah...') as HTMLInputElement;
    
    expect(titleInput.value).toBe('Mutual');
    expect(ownerInput.value).toBe('Alice');
  });
});
