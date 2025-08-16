'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, Target, BarChart2, Bell, FileText, Layers, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const [isAuthed, setIsAuthed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (!isAuthed) return null;

  const NavItem = ({ href, label, icon: Icon }: any) => (
    <Link href={href} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
      pathname === href ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-100'
    }`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );

  const MobileNavItem = ({ href, label, icon: Icon }: any) => (
    <Link href={href} className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-md text-xs transition-colors ${
      pathname === href ? 'text-blue-600' : 'text-slate-600'
    }`}>
      <Icon className="w-5 h-5" />
      <span className="text-xs">{label}</span>
    </Link>
  );

  const navigationItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/budgets", label: "Budgets", icon: FileText },
    { href: "/insights", label: "Insights", icon: Layers },
    { href: "/accounts", label: "Accounts", icon: Wallet },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  // Filter navigation items for bottom bar (show only main ones)
  const bottomNavItems = navigationItems.filter(item => 
    ['/', '/budgets', '/insights', '/goals'].includes(item.href)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-slate-200 hover:bg-white"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`md:hidden fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-sm border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Navigation</h2>
            <Button
              onClick={() => setIsMobileOpen(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-56 border-r bg-white/80 backdrop-blur-sm p-4 gap-1">
        <div className="text-sm font-semibold text-slate-500 mb-2">Navigation</div>
        {navigationItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </aside>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 z-40">
        <div className="flex justify-around items-center py-2">
          {bottomNavItems.map((item) => (
            <MobileNavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
          ))}
        </div>
      </div>
    </>
  );
}

