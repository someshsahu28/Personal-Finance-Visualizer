'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/app/page';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface Props { transactions: Transaction[] }

export function CategoryComparisonChart({ transactions }: Props) {
  const { data, prevKey, curKey } = useMemo(() => {
    const now = new Date();
    const curKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth()-1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth()+1).padStart(2,'0')}`;

    const sumByCat = (key:string) => transactions
      .filter(t=>t.type==='expense' && t.date.slice(0,7)===key)
      .reduce((acc, t)=>{ acc[t.category]=(acc[t.category]||0)+t.amount; return acc; }, {} as Record<string,number>);

    const cur = sumByCat(curKey);
    const prevMap = sumByCat(prevKey);

    const allCats = Array.from(new Set([...Object.keys(cur), ...Object.keys(prevMap)]));

    const nameFor = (id:string) => EXPENSE_CATEGORIES.find(c=>c.id===id)?.name || id;

    const data = allCats.map(cat => ({
      category: nameFor(cat),
      previous: prevMap[cat] || 0,
      current: cur[cat] || 0,
    })).sort((a,b)=> (b.current + b.previous) - (a.current + a.previous)).slice(0,10);

    return { data, prevKey, curKey };
  }, [transactions]);

  if (data.length===0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <p>No category comparison data</p>
          <p className="text-sm">Add expenses in the last two months to see this chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} angle={-20} textAnchor="end" height={60} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v)=>`₹${v.toLocaleString()}`} />
          <Tooltip formatter={(v:number, n:string)=>[`₹${v.toLocaleString()}`, n]} />
          <Legend />
          <Bar dataKey="previous" name="Last Month" fill="#94a3b8" radius={[4,4,0,0]} />
          <Bar dataKey="current" name="This Month" fill="#6366f1" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

