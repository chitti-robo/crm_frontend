'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { NAMES, NAV } from '@/lib/data';
import { useCRM } from '@/lib/store';
import LeadDrawer from './LeadDrawer';
import NewLeadDialog from './NewLeadDialog';

export default function Shell({ children }: { children: React.ReactNode }) {
  const { user, ready, role, logout, toast } = useCRM();
  const path = usePathname();
  const router = useRouter();
  const allowed = NAV[role].includes(path);
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace('/login');
    else if (!allowed) router.replace(NAV[role][0]);
  }, [ready, user, allowed, role, router]);
  if (!ready || !user || !allowed) return null;

  return (
    <div className="app">
      <aside>
        <Link href="/" className="brand">L&amp;L CRM<small>AI Solutions</small></Link>
        {NAV[role].map((n) => <Link key={n} href={n} className={n === path ? 'on' : ''}>{NAMES[n]}</Link>)}
        <div className="role">
          <b style={{ display: 'block', color: '#fff', fontSize: 14 }}>{user.name}</b>
          <span>{user.label}</span>
          <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={() => { logout(); router.replace('/login'); }}>Sign out</button>
        </div>
      </aside>
      <main>{children}</main>
      <LeadDrawer />
      <NewLeadDialog />
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
