'use client';

import { Settings2, Shield, Bell, Key, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0', maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <Settings2 size={36} color="var(--primary)" />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700 }}>Account Settings</h1>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <Shield size={24} color="var(--secondary)" />
            <h2 style={{ fontSize: '1.5rem' }}>Profile Security</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Manage your password, two-factor authentication, and active sessions.</p>
          <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={18} /> Update Password
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <Bell size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.5rem' }}>Notifications</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <span>Email alerts when your reported issues are updated</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
              <span> Weekly digest of municipal activities</span>
            </label>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
            <Trash2 size={24} color="#EF4444" />
            <h2 style={{ fontSize: '1.5rem', color: '#EF4444' }}>Danger Zone</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Permanently delete your account and remove all personal associative data from the CivicSense platform.</p>
          <button className="btn" style={{ background: '#EF4444', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none' }}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
