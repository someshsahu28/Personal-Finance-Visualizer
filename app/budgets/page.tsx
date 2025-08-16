'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BudgetManager } from '@/components/BudgetManager';
import BudgetChart from '@/components/BudgetChart';
import Header from '@/components/Header';
import { ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  month: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
}

export default function BudgetsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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

  // Budget management functions
  const handleAddBudgetAPI = async (budgetData: Omit<Budget, 'id'>) => {
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(budgetData),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const formattedBudget = {
          ...data.budget,
          id: data.budget._id
        };
        setBudgets(prev => [
          ...prev.filter(b => !(b.categoryId === budgetData.categoryId && b.month === budgetData.month)),
          formattedBudget
        ]);
      } else {
        const error = await response.json();
        console.error('Error adding budget:', error.error);
      }
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleDeleteBudgetAPI = async (id: string) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setBudgets(prev => prev.filter(b => b.id !== id));
      } else {
        const error = await response.json();
        console.error('Error deleting budget:', error.error);
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

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

  const currentMonthBudgets = budgets.filter(budget => budget.month === currentMonth);

  // Calculate budget statistics
  const totalBudgeted = currentMonthBudgets.reduce((acc, budget) => acc + budget.amount, 0);
  const currentMonthExpenses = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, t) => acc + t.amount, 0);

  const budgetRemaining = totalBudgeted - currentMonthExpenses;
  const budgetUsedPercentage = totalBudgeted > 0 ? (currentMonthExpenses / totalBudgeted) * 100 : 0;

  // Budget management functions
  const handleAddBudget = async (budgetData: Omit<Budget, 'id'>) => {
    await handleAddBudgetAPI(budgetData);
  };

  const handleDeleteBudget = async (id: string) => {
    await handleDeleteBudgetAPI(id);
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  // Calculate expenses by category for the current month
  const currentMonthExpensesByCategory = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(currentMonth))
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="space-y-4 sm:space-y-6">
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
            <h2 className="text-2xl font-bold text-slate-900">Budget Management</h2>
            <p className="text-slate-600">Manage your monthly budgets and track spending</p>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Budgeted</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800">${totalBudgeted.toFixed(0)}</div>
              <p className="text-xs text-slate-600">For {currentMonth}</p>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 backdrop-blur-sm ${budgetRemaining >= 0 ? 'border-green-200' : 'border-red-200'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${budgetRemaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                Budget Remaining
              </CardTitle>
              <TrendingUp className={`h-4 w-4 ${budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${budgetRemaining >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                ${Math.abs(budgetRemaining).toFixed(0)}
              </div>
              <p className="text-xs text-slate-600">
                {budgetRemaining >= 0 ? 'Under budget' : 'Over budget'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Budget Used</CardTitle>
              <Target className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-800">{budgetUsedPercentage.toFixed(1)}%</div>
              <p className="text-xs text-slate-600">Of total budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Budget Management and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Manager */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Set Monthly Budgets</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetManager
                budgets={budgets}
                currentMonth={currentMonth}
                onMonthChange={handleMonthChange}
                onAddBudget={handleAddBudget}
                onDeleteBudget={handleDeleteBudget}
              />
            </CardContent>
          </Card>

          {/* Budget Chart */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Budget vs Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetChart
                budgets={currentMonthBudgets}
                expenses={currentMonthExpensesByCategory}
                currentMonth={currentMonth}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
