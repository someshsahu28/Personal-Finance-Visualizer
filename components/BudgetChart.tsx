'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Budget } from '@/app/page';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface BudgetChartProps {
  budgets: Budget[];
  expenses: Record<string, number>;
  currentMonth: string;
}

export function BudgetChart({ budgets, expenses, currentMonth }: BudgetChartProps) {
  const chartData = useMemo(() => {
    const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
    
    return currentMonthBudgets.map(budget => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === budget.categoryId);
      const spent = expenses[budget.categoryId] || 0;
      const remaining = budget.amount - spent;
      const percentage = (spent / budget.amount) * 100;
      
      return {
        category: category?.name || 'Unknown',
        budgeted: budget.amount,
        spent: spent,
        remaining: Math.max(0, remaining),
        percentage: percentage,
        color: category?.color || '#6b7280',
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good',
      };
    }).sort((a, b) => b.percentage - a.percentage);
  }, [budgets, expenses, currentMonth]);

  const totalBudgeted = chartData.reduce((sum, item) => sum + item.budgeted, 0);
  const totalSpent = chartData.reduce((sum, item) => sum + item.spent, 0);
  const overBudgetCount = chartData.filter(item => item.status === 'over').length;
  const warningCount = chartData.filter(item => item.status === 'warning').length;

  if (chartData.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Budget vs Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-slate-500">
            <div className="text-center">
              <p>No budgets set for this month</p>
              <p className="text-sm">Set some budgets to see the comparison</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="font-medium text-slate-900">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-slate-600">
              Budgeted: <span className="font-medium">${data.budgeted.toLocaleString()}</span>
            </p>
            <p className="text-slate-600">
              Spent: <span className="font-medium">${data.spent.toLocaleString()}</span>
            </p>
            <p className="text-slate-600">
              Usage: <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900">
          Budget vs Actual
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-slate-600">
            Total Budgeted: ${totalBudgeted.toLocaleString()}
          </Badge>
          <Badge variant="outline" className="text-slate-600">
            Total Spent: ${totalSpent.toLocaleString()}
          </Badge>
          {overBudgetCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              {overBudgetCount} Over Budget
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1 bg-amber-100 text-amber-800">
              <TrendingUp className="h-3 w-3" />
              {warningCount} Near Limit
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="budgeted" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="budgeted" />
                <Bar dataKey="spent" radius={[4, 4, 0, 0]} name="spent">
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'over' ? '#ef4444' : entry.status === 'warning' ? '#f59e0b' : '#10b981'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Details */}
          <div className="space-y-3">
            <h4 className="font-medium text-slate-900">Category Details</h4>
            <div className="space-y-2">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <p className="font-medium text-slate-900">{item.category}</p>
                      <p className="text-sm text-slate-500">
                        ${item.spent.toLocaleString()} of ${item.budgeted.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-semibold ${
                        item.status === 'over' ? 'text-red-600' : 
                        item.status === 'warning' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {item.percentage.toFixed(1)}%
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.remaining > 0 ? `$${item.remaining.toLocaleString()} left` : 'Over budget'}
                      </p>
                    </div>
                    {item.status === 'over' ? (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    ) : item.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}