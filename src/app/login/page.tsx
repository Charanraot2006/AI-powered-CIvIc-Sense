'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { MapPin, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [role, setRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for error in URL (NextAuth default behavior)
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'CredentialsSignin') {
      setError('Invalid email, password, or role mismatch.');
    }
  }, [searchParams]);

  // If already logged in, redirect to appropriate page
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // @ts-ignore
      const userRole = session.user.role;
      router.push(userRole === 'authority' ? '/dashboard' : '/report');
    }
  }, [status, session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role,
        redirect: false, // Handle redirect manually to capture errors
      });

      if (result?.error) {
        setError('Invalid credentials or role mismatch. Please try again.');
        setLoading(false);
      } else if (result?.ok) {
        // Success - redirect based on input role for immediate UX, 
        // but session check above will ensure consistency
        router.push(role === 'authority' ? '/dashboard' : '/report');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        
        {/* Decorative background glow */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.3 }} />
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--secondary)', filter: 'blur(80px)', opacity: 0.3 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <MapPin size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to continue to CivicSense</p>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid #EF4444', 
              color: '#F87171', 
              padding: '0.75rem', 
              borderRadius: 'var(--radius-sm)', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              textAlign: 'left'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              <button 
                type="button" 
                onClick={() => setRole('citizen')}
                style={{ 
                  flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', 
                  background: role === 'citizen' ? 'var(--surface)' : 'transparent',
                  color: role === 'citizen' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: role === 'citizen' ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: role === 'citizen' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Citizen
              </button>
              <button 
                type="button" 
                onClick={() => setRole('authority')}
                style={{ 
                  flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: 'none', 
                  background: role === 'authority' ? 'var(--surface)' : 'transparent',
                  color: role === 'authority' ? 'var(--secondary)' : 'var(--text-muted)',
                  fontWeight: role === 'authority' ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: role === 'authority' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                Authority
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left', marginTop: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email" 
                style={{ 
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', 
                  background: 'var(--surface)', color: 'var(--text-main)' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
                placeholder="Enter your password" 
                style={{ 
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', 
                  background: 'var(--surface)', color: 'var(--text-main)' 
                }} 
              />
            </div>

            <button type="submit" className={`btn ${role === 'citizen' ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
              {loading ? 'Authenticating...' : `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
            </button>
          </form>

          {role === 'citizen' && (
            <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Don't have an account? <Link href="/register" style={{ color: 'var(--primary)' }}>Register here</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
