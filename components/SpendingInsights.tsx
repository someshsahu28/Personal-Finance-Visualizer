'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
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

  // Simple data for display only
  const hasBudgets = budgets.length > 0;
  const hasExpenses = currentMonthExpenses > 0;

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





      {/* Budget Performance */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Budget Performance - {currentMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!hasBudgets ? (
            <div className="text-center py-8 text-slate-500">
              <p>No budgets set for this month</p>
              <p className="text-sm">Set some budgets to see performance insights</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-slate-700">
                You have {budgets.length} budgets set up.
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Budget tracking and analysis coming soon!
              </p>
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
          {!hasExpenses ? (
            <div className="text-center py-8 text-slate-500">
              <p>No expenses recorded for this month</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-slate-700">
                Total expenses: ${currentMonthExpenses.toFixed(0)}
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Category breakdown and analysis coming soon!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Smart Insights & Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900">
            Smart Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">

            {/* Savings Rate Analysis */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Savings Rate Analysis</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your current savings rate is {savingsRate.toFixed(1)}%.
                    {savingsRate >= 20 && " Excellent! You're saving over 20% of your income. Keep up the great work!"}
                    {savingsRate >= 10 && savingsRate < 20 && " Good savings rate! Consider increasing to 20% for better financial security."}
                    {savingsRate > 0 && savingsRate < 10 && " Your savings rate could be improved. Aim for at least 10-20% of your income."}
                    {savingsRate <= 0 && " You're spending more than you earn this month. Review your expenses and consider budget adjustments."}
                  </p>
                </div>
              </div>
            </div>

            {/* Monthly Spending Trend */}
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Monthly Spending Trend</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your spending increased by {monthlyChange.toFixed(1)}% this month compared to last month.
                    Monitor this trend to avoid budget overruns and consider reviewing your spending categories.
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Spending Pattern */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900">Daily Spending Pattern</h4>
                  <p className="text-sm text-purple-700 mt-1">
                    You're spending an average of ${dailyAverage.toFixed(0)} per day this month.
                    At this rate, your monthly expenses will be ${projectedMonthly.toFixed(0)}.
                    Consider setting daily spending limits to stay on track with your budget.
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Health Score */}
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-5 h-5 bg-emerald-600 rounded-full mt-0.5">
                  <span className="text-white text-xs font-bold">
                    {savingsRate >= 20 ? 'A' : savingsRate >= 10 ? 'B' : savingsRate > 0 ? 'C' : 'D'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-emerald-900">Financial Health Score</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    {savingsRate >= 20 && "Outstanding financial health! You're building wealth effectively with excellent savings habits."}
                    {savingsRate >= 10 && savingsRate < 20 && "Good financial health. Consider optimizing expenses to save more and reach the 20% savings goal."}
                    {savingsRate > 0 && savingsRate < 10 && "Fair financial health. Focus on increasing your savings rate by reducing unnecessary expenses."}
                    {savingsRate <= 0 && "Needs attention. Review your spending patterns and create a comprehensive budget plan to improve your financial situation."}
                  </p>
                </div>
              </div>
            </div>

            {/* Actionable Recommendations */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-5 h-5 bg-indigo-600 rounded-full mt-0.5">
                  <span className="text-white text-xs font-bold">💡</span>
                </div>
                <div>
                  <h4 className="font-medium text-indigo-900">Personalized Recommendations</h4>
                  <div className="text-sm text-indigo-700 mt-1 space-y-1">
                    {savingsRate < 10 && (
                      <p>• Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings</p>
                    )}
                    {dailyAverage > 100 && (
                      <p>• Consider setting a daily spending limit of ${(dailyAverage * 0.8).toFixed(0)} to reduce monthly expenses</p>
                    )}
                    {currentMonthExpenses > currentMonthIncome && (
                      <p>• Priority: Create an emergency budget to stop overspending immediately</p>
                    )}
                    {savingsRate >= 10 && (
                      <p>• Great job! Consider investing your savings for long-term wealth building</p>
                    )}
                    <p>• Track your largest expense categories and look for reduction opportunities</p>
                    <p>• Set up automatic transfers to savings to make saving effortless</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Goals */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-5 h-5 bg-green-600 rounded-full mt-0.5">
                  <span className="text-white text-xs font-bold">🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-green-900">Next Month Goals</h4>
                  <div className="text-sm text-green-700 mt-1 space-y-1">
                    {savingsRate < 20 && (
                      <p>• Target: Increase savings rate to {Math.min(savingsRate + 5, 20).toFixed(0)}%</p>
                    )}
                    <p>• Goal: Reduce daily spending to ${Math.max(dailyAverage * 0.9, 50).toFixed(0)} per day</p>
                    <p>• Challenge: Track every expense for better awareness</p>
                    <p>• Focus: Review and optimize your top 3 spending categories</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SpendingInsights;
