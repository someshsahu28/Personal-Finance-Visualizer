'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/app/page';

interface MonthlyChartProps {
  transactions: Transaction[];
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const monthlyData = useMemo(() => {
    const monthlyExpenses: { [key: string]: number } = {};
    const monthlyIncome: { [key: string]: number } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (transaction.type === 'expense') {
        monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + transaction.amount;
      } else {
        monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + transaction.amount;
      }
    });

    const allMonths = new Set([...Object.keys(monthlyExpenses), ...Object.keys(monthlyIncome)]);
    
    return Array.from(allMonths)
      .sort()
      .map(month => {
        const [year, monthNum] = month.split('-');
        const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        
        return {
          month: monthName,
          expenses: monthlyExpenses[month] || 0,
          income: monthlyIncome[month] || 0,
        };
      })
      .slice(-6); // Show last 6 months
  }, [transactions]);

  if (monthlyData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <p>No data available</p>
          <p className="text-sm">Add some transactions to see the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number, name: string) => [
              `$${value.toLocaleString()}`,
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
          />
          <Bar 
            dataKey="expenses" 
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
            name="expenses"
          />
          <Bar 
            dataKey="income" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="income"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}