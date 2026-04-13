'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import 3D scene to prevent SSR hydration mismatch with Canvas
const InteractiveScene = dynamic(() => import('../components/InteractiveScene'), { ssr: false });

export default function Home() {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 80px)' }}>
      {/* 3D Scene Background Layer */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '600px', opacity: 0.8 }}>
        <InteractiveScene />
      </div>

      <section className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '8rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }} className="animate-fade-in">
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800, background: 'linear-gradient(45deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Empower Your Community with AI
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem' }}>
            CivicSense enables citizens to instantly report local issues like road damage and waste management. Using cutting-edge AI, we classify and prioritize reports to help authorities act faster.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Report an Issue
            </Link>
            <Link href="/login" className="btn btn-outline" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      <section className="container" style={{ position: 'relative', zIndex: 1, marginTop: '8rem', marginBottom: '4rem' }}>
        <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel interactive" style={{ textAlign: 'center', cursor: 'default' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>Smart Classification</h3>
            <p style={{ color: 'var(--text-muted)' }}>Our AI instantly analyzes descriptions and images to categorize and prioritize the issue severity correctly.</p>
          </div>
          <div className="glass-panel interactive" style={{ textAlign: 'center', cursor: 'default' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--secondary)' }}>Real-time Tracking</h3>
            <p style={{ color: 'var(--text-muted)' }}>Receive live updates when municipal teams validate, assign, and resolve the reports you made.</p>
          </div>
          <div className="glass-panel interactive" style={{ textAlign: 'center', cursor: 'default' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#8B5CF6' }}>Data-driven Insights</h3>
            <p style={{ color: 'var(--text-muted)' }}>Authorities use our advanced analytics dashboard to identify problem hotspots and optimize resource flow.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
