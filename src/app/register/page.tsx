'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { registerUser } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await registerUser({ name, email, password, role });
      
      if (result.success) {
        toast.success('Account created successfully! Please login.');
        router.push('/login');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
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
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join CivicSense as a {role}</p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
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
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe" 
                style={{ 
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', 
                  background: 'var(--surface)', color: 'var(--text-main)' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com" 
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
                minLength={6}
                placeholder="Min 6 characters" 
                style={{ 
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', 
                  background: 'var(--surface)', color: 'var(--text-main)' 
                }} 
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Authority accounts are provisioned internally by network administrators. If you represent municipal authorities, please contact your support administration.
          </p>

          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary)' }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
