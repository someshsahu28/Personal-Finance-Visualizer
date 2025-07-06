'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar, DollarSign } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

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
  const insights = useMemo(() => {
    // Filter transactions for current month
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const transactionMonth = transactionDate.getFullYear() + '-' +
        String(transactionDate.getMonth() + 1).padStart(2, '0');
      return transactionMonth === currentMonth;
    });

    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const currentMonthIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const savingsRate = currentMonthIncome > 0
      ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100
      : 0;

    const dailyAverage = currentMonthExpenses / 30;
    const projectedMonthly = dailyAverage * 30;
    const monthlyChange = 5.2; // Simplified for now

    // Category analysis
    const categoryExpenses: Record<string, number> = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
      });

    // Budget analysis
    const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
    const budgetAnalysis = currentMonthBudgets.map(budget => {
      const spent = categoryExpenses[budget.categoryId] || 0;
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === budget.categoryId);
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        categoryId: budget.categoryId,
        categoryName: category?.name || 'Unknown',
        categoryColor: category?.color || '#6b7280',
        budgeted: budget.amount,
        spent,
        percentage,
        remaining: budget.amount - spent,
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good',
      };
    });

    // Top spending categories
    const topCategories = Object.entries(categoryExpenses)
      .map(([categoryId, amount]) => {
        const category = EXPENSE_CATEGORIES.find(cat => cat.id === categoryId);
        return {
          categoryId,
          categoryName: category?.name || 'Unknown',
          categoryColor: category?.color || '#6b7280',
          amount,
          percentage: currentMonthExpenses > 0 ? (amount / currentMonthExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      currentMonthExpenses,
      currentMonthIncome,
      savingsRate,
      dailyAverage,
      projectedMonthly,
      monthlyChange,
      budgetAnalysis,
      topCategories,
    };
  }, [transactions, budgets, currentMonth]);

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
              +{insights.monthlyChange.toFixed(1)}%
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
              ${insights.dailyAverage.toFixed(0)}
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
              ${insights.projectedMonthly.toFixed(0)}
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
              {insights.savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">of income saved</p>
          </CardContent>
        </Card>
      </div>

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
              <p className="text-2xl font-bold text-red-800">${insights.currentMonthExpenses.toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Total Income</p>
              <p className="text-2xl font-bold text-green-800">${insights.currentMonthIncome.toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">Net Savings</p>
              <p className="text-2xl font-bold text-blue-800">${(insights.currentMonthIncome - insights.currentMonthExpenses).toFixed(0)}</p>
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

      {/* Budget Performance */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Budget Performance - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.budgetAnalysis.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No budgets set for this month</p>
              <p className="text-sm">Set some budgets to see performance insights</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.budgetAnalysis.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: budget.categoryColor }}
                      />
                      <span className="font-medium text-slate-900">{budget.categoryName}</span>
                      <Badge
                        variant={budget.status === 'over' ? 'destructive' : budget.status === 'warning' ? 'secondary' : 'default'}
                        className={budget.status === 'warning' ? 'bg-amber-100 text-amber-800' : ''}
                      >
                        {budget.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {budget.remaining > 0 ? (
                          <span>${budget.remaining.toLocaleString()} left</span>
                        ) : (
                          <span>${Math.abs(budget.remaining).toLocaleString()} over</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(budget.percentage, 100)}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Spending Categories */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Top Spending Categories - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {insights.topCategories.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No expenses recorded for this month</p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.topCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-slate-200 rounded-full text-sm font-bold text-slate-600">
                      {index + 1}
                    </div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.categoryColor }}
                    />
                    <div>
                      <p className="font-medium text-slate-900">{category.categoryName}</p>
                      <p className="text-sm text-slate-500">{category.percentage.toFixed(1)}% of total expenses</p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${category.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart Insights */}
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
                  {insights.savingsRate >= 20
                    ? "Excellent! You're saving over 20% of your income. Keep up the great work!"
                    : insights.savingsRate >= 10
                    ? "Good savings rate! Consider increasing to 20% for better financial security."
                    : insights.savingsRate > 0
                    ? "Your savings rate could be improved. Aim for at least 10-20% of your income."
                    : "You're spending more than you earn this month. Review your expenses and consider budget adjustments."
                  }
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
