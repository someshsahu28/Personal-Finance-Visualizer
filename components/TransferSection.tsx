'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface Account { _id: string; name: string; }

export default function TransferSection({ accounts, onCreated }: { accounts: Account[]; onCreated: () => void }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10));
  const [note, setNote] = useState('');
  const [list, setList] = useState<any[]>([]);

  const load = async () => {
    const res = await fetch('/api/transfers', { credentials: 'include' });
    if (res.ok) { const data = await res.json(); setList(data.transfers || []); }
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/transfers', {
      method: 'POST', headers: { 'Content-Type':'application/json' }, credentials: 'include',
      body: JSON.stringify({ fromAccountId: from, toAccountId: to, amount, date, note })
    });
    if (res.ok) { setFrom(''); setTo(''); setAmount(''); setNote(''); await load(); onCreated(); }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div>
          <Label>From</Label>
          <select className="border rounded px-3 py-2 w-full" value={from} onChange={e=>setFrom(e.target.value)}>
            <option value="">Select</option>
            {accounts.map(a=> <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <Label>To</Label>
          <select className="border rounded px-3 py-2 w-full" value={to} onChange={e=>setTo(e.target.value)}>
            <option value="">Select</option>
            {accounts.map(a=> <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <Label>Amount (₹)</Label>
          <Input type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <Button type="submit" className="md:col-span-5">Record Transfer</Button>
      </form>

      <div className="space-y-2">
        {list.length===0 ? (
          <div className="text-slate-500 text-sm">No transfers yet.</div>
        ) : list.map(t => (
          <div key={t._id} className="p-3 border rounded bg-slate-50 flex items-center justify-between">
            <div className="text-sm">{new Date(t.date).toLocaleDateString()} • {t.note || 'Transfer'}</div>
            <div className="font-medium">₹{t.amount.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

