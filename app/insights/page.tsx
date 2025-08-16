'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { ArrowLeft, TrendingUp, AlertTriangle, Target } from 'lucide-react';

// Dynamically import SpendingInsights to prevent SSR issues
const SpendingInsights = dynamic(() => import('@/components/SpendingInsights').then(mod => ({ default: mod.default })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-slate-500">Loading insights...</div>
});

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string;
}

export default function InsightsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Load user data from API
  const loadUserData = async () => {
    try {
      // Load transactions
      const transactionsResponse = await fetch('/api/transactions', {
        method: 'GET',
        credentials: 'include'
      });

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json();
        const formattedTransactions = (transactionsData.transactions || []).map((t: any) => ({
          ...t,
          id: t._id,
          date: new Date(t.date).toISOString().split('T')[0]
        }));
        setTransactions(formattedTransactions);
      }

      // Load budgets
      const budgetsResponse = await fetch('/api/budgets', {
        method: 'GET',
        credentials: 'include'
      });

      if (budgetsResponse.ok) {
        const budgetsData = await budgetsResponse.json();
        const formattedBudgets = (budgetsData.budgets || []).map((b: any) => ({
          ...b,
          id: b._id
        }));
        setBudgets(formattedBudgets);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Check authentication with API
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);

          // Load user data from API
          await loadUserData();
        } else {
          // Not authenticated, redirect to signin
          router.push('/signin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Calculate quick stats for the header
  const currentMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));
  const currentMonthExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  
  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);
  const totalBudgeted = currentMonthBudgets.reduce((acc, budget) => acc + budget.amount, 0);
  
  // Calculate budget alerts
  const budgetAlerts = currentMonthBudgets.filter(budget => {
    const categoryExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category === budget.categoryId)
      .reduce((acc, t) => acc + t.amount, 0);
    return categoryExpenses > budget.amount * 0.8; // Alert when 80% of budget is used
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Header />

        {/* Back Button and Page Title */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Financial Insights</h2>
            <p className="text-slate-600">Analyze your spending patterns and get personalized recommendations</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Monthly Expenses</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">${currentMonthExpenses.toFixed(0)}</div>
              <p className="text-xs text-slate-600">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Budgeted</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">${totalBudgeted.toFixed(0)}</div>
              <p className="text-xs text-slate-600">For {currentMonth}</p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 backdrop-blur-sm ${budgetAlerts > 0 ? 'border-amber-200' : 'border-purple-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${budgetAlerts > 0 ? 'text-amber-700' : 'text-purple-700'}`}>
                Budget Alerts
              </CardTitle>
              <AlertTriangle className={`h-4 w-4 ${budgetAlerts > 0 ? 'text-amber-600' : 'text-purple-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${budgetAlerts > 0 ? 'text-amber-800' : 'text-purple-800'}`}>
                {budgetAlerts}
              </div>
              <p className="text-xs text-slate-600">
                {budgetAlerts > 0 ? 'Categories over 80%' : 'All on track'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Spending Insights Component */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <SpendingInsights
              transactions={transactions}
              budgets={budgets}
              currentMonth={currentMonth}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
