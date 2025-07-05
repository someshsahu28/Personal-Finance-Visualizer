"use client";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Budget } from '@/app/page';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface BudgetChartProps {
  budgets: Budget[];
  expenses: Record<string, number>;
  currentMonth: string;
}

interface BudgetData {
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  status: 'good' | 'warning' | 'over';
  color: string;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budgets, expenses, currentMonth }) => {
  const chartData: BudgetData[] = useMemo(() => {
    const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

    if (currentMonthBudgets.length === 0) {
      return [];
    }

    return currentMonthBudgets.map(budget => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === budget.categoryId);
      const spent = expenses[budget.categoryId] || 0;
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;

      return {
        category: category?.name || 'Unknown',
        budgeted: budget.amount,
        spent,
        remaining: Math.max(0, remaining),
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good',
        color: category?.color || '#6b7280',
      };
    });
  }, [budgets, expenses, currentMonth]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        <div className="text-center">
          <p>No budget data available</p>
          <p className="text-sm">Set some budgets for this month to see the chart</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              Budgeted: ${data.budgeted.toLocaleString()}
            </p>
            <p className="text-red-600">
              Spent: ${data.spent.toLocaleString()}
            </p>
            <p className={`${data.remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.remaining > 0 ? 'Remaining' : 'Over budget'}: ${Math.abs(data.remaining).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* @ts-ignore */}
      <ResponsiveContainer width="100%" height={350}>
        {/* @ts-ignore */}
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          {/* @ts-ignore */}
          <XAxis dataKey="category" />
          {/* @ts-ignore */}
          <YAxis />
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip />} />
          {/* @ts-ignore */}
          <Bar dataKey="budgeted" fill="#e2e8f0" name="Budgeted" />
          {/* @ts-ignore */}
          <Bar dataKey="spent" fill="#10b981" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;
