'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Target, BarChart2, Bell, FileText, Layers } from 'lucide-react';

export default function Sidebar() {
  const [isAuthed, setIsAuthed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' });
        setIsAuthed(res.ok);
      } catch {
        setIsAuthed(false);
      }
    })();
  }, []);

  if (!isAuthed) return null;

  const NavItem = ({ href, label, icon: Icon }: any) => (
    <Link href={href} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
      pathname === href ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
    }`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );

  return (
    <aside className="hidden md:flex md:flex-col w-56 border-r bg-white/80 backdrop-blur-sm p-4 gap-1">
      <div className="text-sm font-semibold text-slate-500 mb-2">Navigation</div>
      <NavItem href="/" label="Dashboard" icon={Home} />
      <NavItem href="/budgets" label="Budgets" icon={FileText} />
      <NavItem href="/insights" label="Insights" icon={Layers} />
      <NavItem href="/accounts" label="Accounts" icon={Wallet} />
      <NavItem href="/goals" label="Goals" icon={Target} />
      <NavItem href="/analytics" label="Analytics" icon={BarChart2} />
      <NavItem href="/notifications" label="Notifications" icon={Bell} />
    </aside>
  );
}

