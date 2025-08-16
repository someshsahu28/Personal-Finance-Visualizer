import './globals.css';
import type { Metadata } from 'next';

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
        <div className="min-h-screen max-w-7xl mx-auto p-2 sm:p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
