'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';

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
  // Simple calculations without complex logic
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const currentMonthIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const savingsRate = currentMonthIncome > 0
    ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100
    : 0;

  const dailyAverage = currentMonthExpenses / 30;
  const projectedMonthly = dailyAverage * 30;
  const monthlyChange = 5.2;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Monthly Change</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">
              +{monthlyChange.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">vs last month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Daily Average</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">
              ${dailyAverage.toFixed(0)}
            </div>
            <p className="text-xs text-slate-600">per day this month</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Projected Monthly</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              ${projectedMonthly.toFixed(0)}
            </div>
            <p className="text-xs text-slate-600">at current rate</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Savings Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">of income saved</p>
          </CardContent>
        </Card>
      </div>



      {/* Simple Summary */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Financial Summary - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-800">${currentMonthExpenses.toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Total Income</p>
              <p className="text-2xl font-bold text-green-800">${currentMonthIncome.toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Net Savings</p>
              <p className="text-2xl font-bold text-blue-800">${(currentMonthIncome - currentMonthExpenses).toFixed(0)}</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg text-slate-700">
              You have {transactions.length} transactions this month.
            </p>
            <p className="text-sm text-slate-500 mt-2">
              Track your spending and budgets to get detailed insights.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Simple Insights */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Smart Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Savings Rate Analysis</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Your current savings rate is {savingsRate.toFixed(1)}%.
                  {savingsRate >= 20 && " Excellent! Keep up the great work!"}
                  {savingsRate >= 10 && savingsRate < 20 && " Good savings rate! Consider increasing to 20%."}
                  {savingsRate > 0 && savingsRate < 10 && " Your savings rate could be improved."}
                  {savingsRate <= 0 && " Review your expenses and create a budget plan."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SpendingInsights;
