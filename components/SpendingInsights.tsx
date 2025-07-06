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
  const insights = useMemo(() => {
    try {
      const currentDate = new Date();
      const currentMonthDate = new Date(currentMonth + '-01');
      const previousMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1);
      const previousMonthKey = previousMonth.getFullYear() + '-' + String(previousMonth.getMonth() + 1).padStart(2, '0');

    // Current month expenses
    const currentMonthExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getFullYear() + '-' + String(transactionDate.getMonth() + 1).padStart(2, '0');
        return t.type === 'expense' && transactionMonth === currentMonth;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    // Previous month expenses
    const previousMonthExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getFullYear() + '-' + String(transactionDate.getMonth() + 1).padStart(2, '0');
        return t.type === 'expense' && transactionMonth === previousMonthKey;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    // Month-over-month change
    const monthlyChange = (previousMonthExpenses > 0 && !isNaN(previousMonthExpenses) && !isNaN(currentMonthExpenses))
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
      : 0;

    // Category analysis
    const categoryExpenses = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getFullYear() + '-' + String(transactionDate.getMonth() + 1).padStart(2, '0');
        return t.type === 'expense' && transactionMonth === currentMonth;
      })
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Budget analysis
    const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
    const budgetAnalysis = currentMonthBudgets.map(budget => {
      const spent = categoryExpenses[budget.categoryId] || 0;
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === budget.categoryId);
      const percentage = (spent / budget.amount) * 100;

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

    // Daily average
    const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
    const currentDateMonth = currentDate.getFullYear() + '-' + String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDay = currentMonth === currentDateMonth
      ? currentDate.getDate()
      : daysInMonth;
    const dailyAverage = currentDay > 0 ? currentMonthExpenses / currentDay : 0;
    const projectedMonthly = dailyAverage * daysInMonth;

    // Savings rate
    const currentMonthIncome = transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        const transactionMonth = transactionDate.getFullYear() + '-' + String(transactionDate.getMonth() + 1).padStart(2, '0');
        return t.type === 'income' && transactionMonth === currentMonth;
      })
      .reduce((acc, t) => acc + t.amount, 0);

    const savingsRate = (currentMonthIncome > 0 && !isNaN(currentMonthIncome) && !isNaN(currentMonthExpenses))
      ? ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100
      : 0;

      return {
        currentMonthExpenses,
        previousMonthExpenses,
        monthlyChange,
        budgetAnalysis,
        topCategories,
        dailyAverage,
        projectedMonthly,
        savingsRate,
        currentMonthIncome,
      };
    } catch (error) {
      console.error('Error calculating insights:', error);
      return {
        currentMonthExpenses: 0,
        previousMonthExpenses: 0,
        monthlyChange: 0,
        budgetAnalysis: [],
        topCategories: [],
        dailyAverage: 0,
        projectedMonthly: 0,
        savingsRate: 0,
        currentMonthIncome: 0,
      };
    }
  }, [transactions, budgets, currentMonth]);

  const monthName = (() => {
    try {
      return new Date(currentMonth + '-01').toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return currentMonth;
    }
  })();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Monthly Change</CardTitle>
            {insights.monthlyChange >= 0 ? (
              <TrendingUp className="h-4 w-4 text-red-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              insights.monthlyChange >= 0 ? 'text-red-800' : 'text-green-800'
            }`}>
              {insights.monthlyChange >= 0 ? '+' : ''}{insights.monthlyChange.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">
              vs last month
            </p>
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
            <p className="text-xs text-slate-600">
              per day this month
            </p>
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
            <p className="text-xs text-slate-600">
              at current rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">Savings Rate</CardTitle>
            <DollarSign className={`h-4 w-4 ${
              insights.savingsRate >= 20 ? 'text-green-600' :
              insights.savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              insights.savingsRate >= 20 ? 'text-green-800' :
              insights.savingsRate >= 10 ? 'text-yellow-800' : 'text-red-800'
            }`}>
              {insights.savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-slate-600">
              of income saved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Performance */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Budget Performance - {monthName}
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
            Top Spending Categories - {monthName}
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

      {/* Insights & Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Smart Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Savings Rate Insight */}
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

            {/* Monthly Trend Insight */}
            <div className={`p-4 rounded-lg border ${
              insights.monthlyChange > 10
                ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                : insights.monthlyChange > 0
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            }`}>
              <div className="flex items-start space-x-3">
                {insights.monthlyChange > 0 ? (
                  <TrendingUp className={`h-5 w-5 mt-0.5 ${
                    insights.monthlyChange > 10 ? 'text-red-600' : 'text-yellow-600'
                  }`} />
                ) : (
                  <TrendingDown className="h-5 w-5 text-green-600 mt-0.5" />
                )}
                <div>
                  <h4 className={`font-medium ${
                    insights.monthlyChange > 10 ? 'text-red-900' :
                    insights.monthlyChange > 0 ? 'text-yellow-900' : 'text-green-900'
                  }`}>
                    Monthly Spending Trend
                  </h4>
                  <p className={`text-sm mt-1 ${
                    insights.monthlyChange > 10 ? 'text-red-700' :
                    insights.monthlyChange > 0 ? 'text-yellow-700' : 'text-green-700'
                  }`}>
                    {insights.monthlyChange > 10 && (
                      <span>Your spending increased by {insights.monthlyChange.toFixed(1)}% this month. Consider reviewing your budget and identifying areas to cut back.</span>
                    )}
                    {insights.monthlyChange > 0 && insights.monthlyChange <= 10 && (
                      <span>Your spending increased by {insights.monthlyChange.toFixed(1)}% this month. Monitor this trend to avoid budget overruns.</span>
                    )}
                    {insights.monthlyChange <= 0 && (
                      <span>Great job! Your spending decreased by {Math.abs(insights.monthlyChange).toFixed(1)}% this month compared to last month.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Budget Alerts */}
            {insights.budgetAnalysis.some(b => b.status !== 'good') && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-900">Budget Alerts</h4>
                    <div className="text-sm text-amber-700 mt-1 space-y-1">
                      {insights.budgetAnalysis
                        .filter(b => b.status === 'over')
                        .map((budget, index) => (
                          <p key={index}>
                            • {budget.categoryName}: Over budget by ${Math.abs(budget.remaining).toLocaleString()}
                          </p>
                        ))}
                      {insights.budgetAnalysis
                        .filter(b => b.status === 'warning')
                        .map((budget, index) => (
                          <p key={index}>
                            • {budget.categoryName}: {budget.percentage.toFixed(1)}% of budget used
                          </p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SpendingInsights;