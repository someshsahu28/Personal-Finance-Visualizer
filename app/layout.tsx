import './globals.css';
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Personal Finance Tracker',
  description: 'Track spending, budgets, goals, and analytics',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="min-h-screen flex">
          <Sidebar />
          <main className="flex-1 md:ml-0">
            <div className="max-w-7xl mx-auto p-2 sm:p-4 pb-20 md:pb-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
