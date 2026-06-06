import { api } from '@/lib/api';
import { ContractFilters, ContractStatus } from '@/types';
import DashboardClient from './DashboardClient';

function isContractStatus(status: string): status is ContractStatus {
  return ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXPIRED', 'TERMINATED'].includes(status);
}

export default async function DashboardPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await props.searchParams;

  // Extract pagination indices and build clean filter descriptors
  const pageStr = typeof resolvedSearchParams.page === 'string' ? resolvedSearchParams.page : '0';
  const sizeStr = typeof resolvedSearchParams.size === 'string' ? resolvedSearchParams.size : '10';
  
  const filters: ContractFilters = {
    title: typeof resolvedSearchParams.title === 'string' ? resolvedSearchParams.title : undefined,
    owner: typeof resolvedSearchParams.owner === 'string' ? resolvedSearchParams.owner : undefined,
    status: typeof resolvedSearchParams.status === 'string' && isContractStatus(resolvedSearchParams.status)
        ? resolvedSearchParams.status
        : undefined,
    page: parseInt(pageStr, 10),
    size: parseInt(sizeStr, 10),
    sortBy: typeof resolvedSearchParams.sortBy === 'string' ? resolvedSearchParams.sortBy : 'createdAt',
    sortDir: resolvedSearchParams.sortDir === 'asc' ? 'asc' : 'desc',
  };

  let contractsPage;
  let errorMsg: string | undefined;

  try {
    contractsPage = await api.getContracts(filters);
  } catch (error) {
    errorMsg = error instanceof Error 
        ? error.message 
        : 'Could not connect to the RayFlow API services. Please verify the backend is running.';
        
    // Return empty payload envelope to allow graceful error card rendering
    contractsPage = {
      content: [],
      totalPages: 0,
      totalElements: 0,
      size: filters.size || 10,
      number: filters.page || 0,
      numberOfElements: 0,
      first: true,
      last: true,
      empty: true,
    };
  }

  return (
    <DashboardClient
      initialContracts={contractsPage}
      initialFilters={filters}
      errorMsg={errorMsg}
    />
  );
}
