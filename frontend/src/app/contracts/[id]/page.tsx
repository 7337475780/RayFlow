import { api, ApiException } from '@/lib/api';
import { Contract, WorkflowHistory } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function ContractDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  let contract: Contract | undefined;
  let history: WorkflowHistory[] = [];
  let errorMsg: string | undefined;

  try {
    // Fetch contract metadata and history logs in parallel to minimize response latency
    const [contractData, historyData] = await Promise.all([
      api.getContractById(id),
      api.getContractHistory(id),
    ]);
    contract = contractData;
    history = historyData;
  } catch (error) {
    if (error instanceof ApiException && error.status === 404) {
      // Trigger Next.js standard 404 handler if contract ID does not exist
      notFound();
    }
    errorMsg = error instanceof Error 
      ? error.message 
      : 'Could not connect to the RayFlow API services. Please verify the backend is running.';
  }

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="app-container" style={{ maxWidth: '1000px' }}>
      {/* Back button */}
      <nav style={{ marginBottom: '24px' }}>
        <Link href="/" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', gap: '8px' }}>
          ← Back to Dashboard
        </Link>
      </nav>

      {errorMsg ? (
        /* Connection Failure State */
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--status-rejected)' }}>
          <h2>Connection Failure</h2>
          <p style={{ marginTop: '8px' }}>{errorMsg}</p>
        </div>
      ) : contract ? (
        /* Two-Column split details layout */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          
          {/* Left Panel: Contract Metadata Details */}
          <main className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className={`badge badge-${contract.status.toLowerCase()}`} style={{ marginBottom: '12px' }}>
                {contract.status.replace('_', ' ')}
              </span>
              <h1 style={{ background: 'none', WebkitTextFillColor: 'var(--text-primary)', fontSize: '26px', lineHeight: '1.3' }}>
                {contract.title}
              </h1>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Contract Owner</h4>
                <p style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{contract.ownerName}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Contract ID</h4>
                <p style={{ color: 'var(--text-primary)', fontSize: '13px', wordBreak: 'break-all' }}>{contract.id}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Created On</h4>
                <p style={{ color: 'var(--text-primary)' }}>{formatDate(contract.createdAt)}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Last Updated</h4>
                <p style={{ color: 'var(--text-primary)' }}>{formatDate(contract.updatedAt)}</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)' }} />

            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Description</h4>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '14px', lineHeight: '1.6' }}>
                  {contract.description || 'No description provided for this contract.'}
                </p>
              </div>
            </div>
          </main>

          {/* Right Panel: Workflow History Audit Timeline */}
          <aside className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2>Workflow Audit History</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Chronological record of status changes and transitions.</p>

            <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', paddingLeft: '24px', marginTop: '8px' }}>
              {/* Timeline Track Line */}
              {history.length > 1 && (
                <div style={{
                  position: 'absolute',
                  left: '6px',
                  top: '12px',
                  bottom: '12px',
                  width: '2px',
                  background: 'linear-gradient(to bottom, var(--accent-color) 0%, rgba(99, 102, 241, 0.15) 100%)'
                }}></div>
              )}

              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                  No workflow audit events recorded for this contract.
                </div>
              ) : (
                history.map((event, idx) => (
                  <div key={event.id} style={{ position: 'relative', marginBottom: idx === history.length - 1 ? '0' : '28px' }}>
                    {/* Circle Bullet Point on Track */}
                    <div style={{
                      position: 'absolute',
                      left: '-23px',
                      top: '6px',
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? 'var(--accent-color)' : 'var(--border-color)',
                      border: idx === 0 ? '2px solid #ffffff' : '2px solid var(--text-muted)',
                      boxShadow: idx === 0 ? '0 0 8px var(--accent-color)' : 'none',
                      zIndex: '2'
                    }}></div>

                    {/* Timeline Event Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {event.previousStatus ? (
                          <>
                            <span className={`badge badge-${event.previousStatus.toLowerCase()}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                              {event.previousStatus.replace('_', ' ')}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>→</span>
                          </>
                        ) : (
                          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Created</span>
                        )}
                        
                        <span className={`badge badge-${event.newStatus.toLowerCase()}`} style={{ padding: '2px 8px', fontSize: '10px' }}>
                          {event.newStatus.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Transitioned by <strong style={{ color: 'var(--text-primary)' }}>{event.changedBy}</strong>
                      </span>
                      
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {formatDate(event.changedAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>

        </div>
      ) : null}
    </div>
  );
}
