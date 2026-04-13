'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Mail, Shield } from 'lucide-react';
import { signOut } from 'next-auth/react';

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-menu-wrapper" ref={menuRef} style={{ position: 'relative' }}>
      <div 
        className={`user-avatar-animated ${isOpen ? 'menu-open' : ''}`} 
        data-email={user.email || 'User Profile'}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        role="button"
        tabIndex={0}
      >
        <User size={20} className="avatar-icon" />
      </div>

      {isOpen && (
        <div className="user-dropdown glass-panel animate-fade-in">
          <div className="dropdown-header">
            <div className="user-identity">
              <p className="user-name">{user.name || 'Civic User'}</p>
              <div className="user-role-tag">
                <Shield size={10} />
                <span>{(user.role as string)?.toUpperCase() || 'CITIZEN'}</span>
              </div>
            </div>
            <div className="user-email-row">
              <Mail size={12} className="email-icon" />
              <span>{user.email}</span>
            </div>
          </div>
          
          <div className="dropdown-divider"></div>
          
          <button 
            className="dropdown-item logout-action" 
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
