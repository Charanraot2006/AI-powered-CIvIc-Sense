import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { MapPin, Settings, User } from 'lucide-react';
import { Toaster } from 'sonner';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import UserMenu from '@/components/UserMenu';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CivicSense - AI Powered Civic Reporting',
  description: 'Report, track, and validate local civic issues with AI.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="navbar">
            <div className="container">
              <Link href="/" className="navbar-brand">
                <MapPin className="logo-icon" size={28} />
                CivicSense
              </Link>
              <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link href={session ? "/report" : "/login"} className="nav-link">Report Issue</Link>
                <Link href={session ? "/dashboard" : "/login"} className="nav-link">Dashboard</Link>
                
                {session ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
                    <Link href="/settings" className="nav-link" title="Settings" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Settings size={20} />
                    </Link>
                    <UserMenu user={session.user!} />
                  </div>
                ) : (
                  <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Login</Link>
                )}
              </div>
            </div>
          </nav>
          <main style={{ flex: 1 }}>
            {children}
          </main>
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
