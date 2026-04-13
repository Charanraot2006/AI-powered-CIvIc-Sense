'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, MapPin, AlertTriangle, Calendar, Navigation, ShieldCheck, Eye, Loader2 } from 'lucide-react';
import { getIssues } from '../actions';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);
  const [issuesList, setIssuesList] = useState<any[]>([]);
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch global issues on mount
    getIssues().then(data => setIssuesList(data));
  }, []);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Verifying credentials...</p>
      </div>
    );
  }

  if (!session) return null;
  
  const userRole = (session?.user as any)?.role || 'citizen';
  const isAuthority = userRole === 'authority';

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthority ? (
              <><ShieldCheck size={36} color="var(--secondary)" /> Authority Dashboard</>
            ) : (
              <><Eye size={36} color="var(--primary)" /> Civic Dashboard <span style={{ fontSize: '1rem', fontWeight: 600, background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px', marginLeft: '0.5rem', opacity: 0.7 }}>(View Only)</span></>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isAuthority ? "Manage city infrastructure and resolve reports." : "Real-time view of civic issues and resolving statuses."}
          </p>
        </div>
        
        {isAuthority && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-outline interactive">Export Data</button>
            <button className="btn btn-primary interactive">Refresh Analytics</button>
          </div>
        )}
      </div>
      
      <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel interactive" style={{ padding: '1.5rem', borderLeft: '4px solid var(--secondary)' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Open Issues</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>{issuesList.length}</p>
        </div>
        <div className="glass-panel interactive" style={{ padding: '1.5rem', borderLeft: '4px solid #EF4444' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Critical Priority</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>7</p>
        </div>
        <div className="glass-panel interactive" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Resolved This Week</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>112</p>
        </div>
        <div className="glass-panel interactive" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending AI Triage</h4>
          <p style={{ fontSize: '2rem', fontWeight: 700 }}>3</p>
        </div>
      </div>

      <div className="glass-panel animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Recent Reports</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ color: 'var(--text-muted)' }}>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Category</th>
              <th style={{ padding: '1rem' }}>Severity</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Date Reported</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {issuesList.map((issue, idx) => (
              <tr key={idx} className="tr-hover" onClick={() => setSelectedIssue(issue)} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.2s' }}>
                <td style={{ padding: '1rem' }}>{issue.id}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{issue.category}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.85rem',
                    background: issue.severity === 'Critical' ? 'rgba(239, 68, 68, 0.2)' : 
                                 issue.severity === 'High' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    color: issue.severity === 'Critical' ? '#FCA5A5' : 
                            issue.severity === 'High' ? '#FCD34D' : '#7DD3FC'
                  }}>
                    {issue.severity}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{issue.status}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{issue.date}</td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Details &rarr;</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedIssue && (
        <div className="modal-overlay" onClick={() => setSelectedIssue(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle color={selectedIssue.severity === 'Critical' ? '#EF4444' : '#F59E0B'} /> 
                  {selectedIssue.category}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={14}/> {selectedIssue.lat}, {selectedIssue.lng}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={14}/> {selectedIssue.date}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
              >
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-muted)' }}>Issue Description</h4>
                {selectedIssue.reporterName && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                    Reported by: {selectedIssue.reporterName}
                  </span>
                )}
              </div>
              <p style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '2rem', border: '1px solid var(--border)' }}>
                {selectedIssue.desc}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>AI Triage Analytics</h4>
                  <div style={{ background: 'var(--surface-glass)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Confidence Score</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>94%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Suggested Dept</span>
                      <span>{selectedIssue.category === 'Water Supply' ? 'Public Utilities' : 'Dept of Transportation'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Estimated Priority</span>
                      <span style={{ color: selectedIssue.severity === 'Critical' ? '#EF4444' : '#F59E0B' }}>{selectedIssue.severity}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Location Overview</h4>
                  <div style={{ height: '150px', background: 'var(--surface-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-muted)' }}>
                    <Navigation size={32} style={{ marginBottom: '0.5rem', color: 'var(--secondary)' }}/>
                    Interactive Map Integration
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button className="btn btn-outline" onClick={() => setSelectedIssue(null)}>Close</button>
              {isAuthority && (
                <button className="btn btn-primary">Assign Resource</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
