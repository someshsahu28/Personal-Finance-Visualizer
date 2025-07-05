'use client';

import { useMemo } from 'react';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/app/page';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface CategoryChartProps {
  transactions: Transaction[];
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    if (expenseTransactions.length === 0) {
      return [];
    }

    const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === transaction.category);
      const categoryName = category ? category.name : 'Other';
      const categoryColor = category ? category.color : '#6b7280';
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          name: categoryName,
          value: 0,
          color: categoryColor,
        };
      }
      acc[categoryName].value += transaction.amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; color: string }>);

    return Object.values(categoryTotals).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (categoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <p>No expense data available</p>
          <p className="text-sm">Add some expense transactions to see the breakdown</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = categoryData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{data.name}</p>
          <p className="text-sm text-slate-600">
            ${data.value.toLocaleString()} ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-700">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-64">
      {/* @ts-ignore */}
      <ResponsiveContainer width="100%" height="100%">
        {/* @ts-ignore */}
        <PieChart>
          {/* @ts-ignore */}
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip />} />
          {/* @ts-ignore */}
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}