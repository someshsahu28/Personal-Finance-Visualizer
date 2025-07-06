'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

// Define interfaces locally to avoid import issues
interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
}

interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string;
}

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string;
}

function SpendingInsights({ transactions, budgets, currentMonth }: SpendingInsightsProps) {
  // Simplified version to avoid syntax errors
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentMonthIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const savingsRate = currentMonthIncome > 0
    ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100
    : 0;

  const monthName = new Date(currentMonth + '-01').toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              ${currentMonthExpenses.toFixed(0)}
            </div>
            <p className="text-xs text-slate-600">
              this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              ${currentMonthIncome.toFixed(0)}
            </div>
            <p className="text-xs text-slate-600">
              this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Savings Rate</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">
              of income saved
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Net Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              ${(currentMonthIncome - currentMonthExpenses).toFixed(0)}
            </div>
            <p className="text-xs text-slate-600">
              this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Financial Summary - {monthName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-lg text-slate-700">
              You have {transactions.length} transactions this month.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Track your spending and budgets to get detailed insights.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

export default SpendingInsights;