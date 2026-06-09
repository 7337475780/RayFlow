'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Contract, ContractFilters, ContractStatus, PaginatedResponse } from '@/types';
import Link from 'next/link';

interface DashboardClientProps {
  initialContracts: PaginatedResponse<Contract>;
  initialFilters: ContractFilters;
  errorMsg?: string;
}

export default function DashboardClient({ initialContracts, initialFilters, errorMsg }: DashboardClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local inputs to hold transient state during typing
  const [titleInput, setTitleInput] = useState(initialFilters.title || '');
  const [ownerInput, setOwnerInput] = useState(initialFilters.owner || '');
  const [statusInput, setStatusInput] = useState<ContractStatus | ''>(initialFilters.status || '');

  // Transition state to handle background refresh loading without page jumps
  const [isPending, startTransition] = useTransition();

  // Propagates criteria updates to the URL query string
  const updateUrl = (newFilters: Partial<ContractFilters>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset to page zero when search filters change
    if (newFilters.page === undefined) {
      if (
        newFilters.title !== undefined || 
        newFilters.owner !== undefined || 
        newFilters.status !== undefined
      ) {
        params.set('page', '0');
      }
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Debounces typing input to mitigate server querying floods
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (titleInput !== (initialFilters.title || '')) {
        updateUrl({ title: titleInput });
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [titleInput]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (ownerInput !== (initialFilters.owner || '')) {
        updateUrl({ owner: ownerInput });
      }
    }, 450);

    return () => clearTimeout(delayDebounce);
  }, [ownerInput]);

  const handleStatusChange = (status: ContractStatus | '') => {
    setStatusInput(status);
    updateUrl({ status });
  };

  const handlePageChange = (newPage: number) => {
    updateUrl({ page: newPage });
  };

  const handleSortChange = (field: string) => {
    const currentSortBy = initialFilters.sortBy || 'createdAt';
    const currentSortDir = initialFilters.sortDir || 'desc';
    
    let newSortDir: 'asc' | 'desc' = 'desc';
    if (currentSortBy === field) {
      newSortDir = currentSortDir === 'desc' ? 'asc' : 'desc';
    }
    
    updateUrl({ sortBy: field, sortDir: newSortDir });
  };

  const renderSortIndicator = (field: string) => {
    const currentSortBy = initialFilters.sortBy || 'createdAt';
    const currentSortDir = initialFilters.sortDir || 'desc';
    
    if (currentSortBy !== field) return null;
    return currentSortDir === 'desc' ? ' ↓' : ' ↑';
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const { content: contracts, totalPages, number: currentPage, totalElements } = initialContracts;

  return (
    <div className="app-container">
      {/* Dashboard Topbar */}
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>RayFlow Contracts</h1>
          <p style={{ marginTop: '4px' }}>Monitor and audit enterprise agreements and approval lifecycles.</p>
        </div>
        
        {isPending && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '13px' }}>Syncing data...</span>
            <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
          </div>
        )}
      </header>

      {errorMsg ? (
        /* Error State Card */
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--status-rejected)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2>Connection Failure</h2>
          <p>{errorMsg}</p>
          <button className="btn btn-primary" onClick={() => router.refresh()} style={{ width: 'fit-content' }}>
            Retry Request
          </button>
        </div>
      ) : (
        <>
          {/* Dashboard Stats Panel */}
          <section className="stats-grid">
            <div className="glass-panel stat-card">
              <div className="stat-card-title">Total Agreements</div>
              <div className="stat-card-value">{totalElements}</div>
            </div>
            <div className="glass-panel stat-card stat-approved">
              <div className="stat-card-title">Approved Contracts</div>
              <div className="stat-card-value">{contracts.filter(c => c.status === 'APPROVED').length}</div>
            </div>
            <div className="glass-panel stat-card stat-pending">
              <div className="stat-card-title">Pending Review</div>
              <div className="stat-card-value">{contracts.filter(c => c.status === 'PENDING_APPROVAL').length}</div>
            </div>
            <div className="glass-panel stat-card stat-action">
              <div className="stat-card-title">Action Required</div>
              <div className="stat-card-value">{contracts.filter(c => c.status === 'REJECTED' || c.status === 'DRAFT').length}</div>
            </div>
          </section>

          {/* Interactive Filters Grid */}
          <section className="glass-panel" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Contract Title</label>
              <input
                type="text"
                placeholder="Search NDA, Lease, SOW..."
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Owner Name</label>
              <input
                type="text"
                placeholder="Search Alice, Bob, Sarah..."
                value={ownerInput}
                onChange={(e) => setOwnerInput(e.target.value)}
                className="form-input"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>Lifecycle Status</label>
              <select
                value={statusInput}
                onChange={(e) => handleStatusChange(e.target.value as ContractStatus | '')}
                className="form-input"
                style={{ cursor: 'pointer' }}
              >
                <option value="">All Lifecycle Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING_APPROVAL">Pending Approval</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="EXPIRED">Expired</option>
                <option value="TERMINATED">Terminated</option>
              </select>
            </div>
          </section>

          {/* Table Container */}
          <main className="glass-panel" style={{ padding: '0', position: 'relative', overflow: 'hidden', opacity: isPending ? 0.65 : 1, transition: 'opacity 0.2s' }}>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th onClick={() => handleSortChange('title')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Contract Title{renderSortIndicator('title')}
                    </th>
                    <th onClick={() => handleSortChange('ownerName')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Owner Name{renderSortIndicator('ownerName')}
                    </th>
                    <th onClick={() => handleSortChange('status')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Status{renderSortIndicator('status')}
                    </th>
                    <th onClick={() => handleSortChange('createdAt')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      Created Date{renderSortIndicator('createdAt')}
                    </th>
                    <th style={{ width: '120px', textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length === 0 ? (
                    /* Empty State Row */
                    <tr>
                      <td colSpan={5} style={{ padding: '72px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                          <span style={{ fontSize: '36px' }}>🔍</span>
                          <h2>No Contracts Available</h2>
                          <p style={{ maxWidth: '440px', margin: '0 auto' }}>
                            We could not find matching records for your current parameters. Try clearing your filter queries.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    contracts.map((contract) => (
                      <tr key={contract.id} className="table-row">
                        <td style={{ fontWeight: '500', color: 'var(--text-primary)' }}>
                          <Link href={`/contracts/${contract.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                            {contract.title}
                          </Link>
                        </td>
                        <td>{contract.ownerName}</td>
                        <td>
                          <span className={`badge badge-${contract.status.toLowerCase()}`}>
                            {contract.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>{formatDate(contract.createdAt)}</td>
                        <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                          <Link href={`/contracts/${contract.id}`} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px', textDecoration: 'none' }}>
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 0 && (
              <footer style={{ borderTop: '1px solid var(--border-color)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Page <strong style={{ color: 'var(--text-primary)' }}>{currentPage + 1}</strong> of <strong style={{ color: 'var(--text-primary)' }}>{totalPages}</strong> ({totalElements} agreements found)
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0 || isPending}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages || isPending}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Next
                  </button>
                </div>
              </footer>
            )}
          </main>
        </>
      )}
    </div>
  );
}
