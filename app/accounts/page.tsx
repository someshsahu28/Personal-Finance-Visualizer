'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import TransferSection from '@/components/TransferSection';

interface Account { _id: string; name: string; type: 'checking'|'savings'|'credit'; openingBalance: number; currency: string; }

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState<'checking'|'savings'|'credit'>('checking');
  const [openingBalance, setOpeningBalance] = useState('0');

  const loadAccounts = async () => {
    const res = await fetch('/api/accounts', { credentials: 'include' });
    if (res.ok) { const data = await res.json(); setAccounts(data.accounts || []); }
  };
  useEffect(() => { loadAccounts(); }, []);

  const addAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/accounts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ name, type, openingBalance })
    });
    if (res.ok) { setName(''); setType('checking'); setOpeningBalance('0'); await loadAccounts(); }
  };

  const totalOpening = useMemo(() => accounts.reduce((a,x)=>a+(x.openingBalance||0),0), [accounts]);

  return (
    <div className="p-4 space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle>New Account</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addAccount} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={e=>setName(e.target.value)} placeholder="HDFC Savings" />
            </div>
            <div>
              <Label>Type</Label>
              <select className="border rounded px-3 py-2 w-full" value={type} onChange={e=>setType(e.target.value as any)}>
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="credit">Credit</option>
              </select>
            </div>
            <div>
              <Label>Opening Balance (₹)</Label>
              <Input type="number" value={openingBalance} onChange={e=>setOpeningBalance(e.target.value)} />
            </div>
            <Button type="submit" className="md:col-span-4">Add Account</Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle>Your Accounts</CardTitle></CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-slate-500">No accounts yet.</div>
          ) : (
            <div className="space-y-3">
              {accounts.map(acc => (
                <div key={acc._id} className="p-4 rounded-lg border bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{acc.name}</div>
                    <div className="text-sm text-slate-600">{acc.type} • Currency: {acc.currency}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600">Opening</div>
                    <div className="text-lg font-semibold">₹{acc.openingBalance.toLocaleString()}</div>
                  </div>
                </div>
              ))}
              <div className="p-3 text-right text-slate-700 font-semibold">Total: ₹{totalOpening.toLocaleString()}</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle>Transfers</CardTitle></CardHeader>
        <CardContent>
          <TransferSection accounts={accounts} onCreated={loadAccounts} />
        </CardContent>
      </Card>
    </div>
  );
}

