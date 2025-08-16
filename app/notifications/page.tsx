'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification { _id: string; type: string; title: string; message: string; read: boolean; createdAt: string; }

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setItems(data.notifications || []);
      }
    })();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="space-y-3">
              <div className="text-slate-500">No notifications yet.</div>
              <button
                className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                onClick={async () => {
                  await fetch('/api/notifications', {
                    method: 'POST', headers: { 'Content-Type':'application/json' }, credentials: 'include',
                    body: JSON.stringify({ type:'summary', title:'Welcome', message:'Notifications are now enabled.' })
                  });
                  const res = await fetch('/api/notifications', { credentials:'include' });
                  if (res.ok) { const data = await res.json(); setItems(data.notifications||[]); }
                }}
              >
                Generate Sample Notification
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(n => (
                <div key={n._id} className={`p-3 rounded border bg-slate-50 ${n.read ? '' : 'border-blue-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{n.title}</div>
                    <div className="text-xs text-slate-500">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-sm text-slate-700">{n.message}</div>
                  <div className="text-xs text-slate-500 mt-1">Type: {n.type}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

