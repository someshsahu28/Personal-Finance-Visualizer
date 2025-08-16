'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MonthlyChart = dynamic(() => import('@/components/MonthlyChart').then(m => ({ default: m.MonthlyChart })), { ssr: false });
const CategoryComparisonChart = dynamic(() => import('@/components/CategoryComparisonChart').then(m => ({ default: m.CategoryComparisonChart })), { ssr: false });

interface Transaction { id: string; amount: number; date: string; description: string; type: 'income'|'expense'; category: string; }

export default function AnalyticsPage() {
  const [tx, setTx] = useState<Transaction[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/transactions', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setTx((data.transactions || []).map((t:any)=>({
          id: t._id || t.id,
          amount: t.amount,
          date: new Date(t.date).toISOString().split('T')[0],
          description: t.description,
          type: t.type,
          category: t.category,
        })));
      }
    })();
  }, []);

  const byMonth = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};
    tx.forEach(t => {
      const key = t.date.slice(0,7);
      if (!map[key]) map[key] = { income: 0, expense: 0 };
      map[key][t.type] += t.amount;
    });
    return map;
  }, [tx]);

  const categoryCompare = useMemo(() => {
    const now = new Date();
    const curKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth()+1).padStart(2,'0')}`;

    const sum = (m:string) => tx.filter(t=>t.type==='expense' && t.date.startsWith(m))
      .reduce((acc, t)=>{ acc[t.category]=(acc[t.category]||0)+t.amount; return acc; }, {} as Record<string,number>);

    return { cur: sum(curKey), prev: sum(prevKey), curKey, prevKey };
  }, [tx]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Link href="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle>Cash Flow (last 6 months)</CardTitle></CardHeader>
        <CardContent>
          <MonthlyChart transactions={tx as any} />
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader><CardTitle>Category Comparison (last vs current month)</CardTitle></CardHeader>
        <CardContent>
          <CategoryComparisonChart transactions={tx as any} />
        </CardContent>
      </Card>
    </div>
  );
}

