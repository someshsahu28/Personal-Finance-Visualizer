'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionList } from '@/components/TransactionList';
import { BudgetManager } from '@/components/BudgetManager';

// Dynamically import chart components to prevent SSR issues
const MonthlyChart = dynamic(() => import('@/components/MonthlyChart').then(mod => ({ default: mod.MonthlyChart })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-slate-500">Loading chart...</div>
});

const CategoryChart = dynamic(() => import('@/components/CategoryChart').then(mod => ({ default: mod.CategoryChart })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-slate-500">Loading chart...</div>
});

const BudgetChart = dynamic(() => import('@/components/BudgetChart').then(mod => ({ default: mod.BudgetChart })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-slate-500">Loading chart...</div>
});

const SpendingInsights = dynamic(() => import('@/components/SpendingInsights').then(mod => ({ default: mod.SpendingInsights })), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-slate-500">Loading insights...</div>
});
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, PieChart, Target, AlertTriangle } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants';

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
  month: string; // YYYY-MM format
}



export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTransactions = localStorage.getItem('transactions');
      const savedBudgets = localStorage.getItem('budgets');

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions));
      }
      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets));
      }
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions([newTransaction, ...transactions]);
    setIsFormOpen(false);
  };

  const editTransaction = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(null);
    setIsFormOpen(false);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleTransactionSubmit = (transaction: Omit<Transaction, 'id'> | Transaction) => {
    if (editingTransaction && 'id' in transaction) {
      // Editing existing transaction
      editTransaction(transaction as Transaction);
    } else {
      // Adding new transaction
      addTransaction(transaction as Omit<Transaction, 'id'>);
    }
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
    };
    setBudgets([...budgets.filter(b => !(b.categoryId === budget.categoryId && b.month === budget.month)), newBudget]);
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Calculate current month expenses by category
  const currentMonthExpenses = transactions
    .filter(t => {
      const transactionDate = new Date(t.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      return t.type === 'expense' && transactionMonth === currentMonth;
    })
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  // Calculate budget status
  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);
  const totalBudget = currentMonthBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(currentMonthExpenses).reduce((sum, amount) => sum + amount, 0);
  const budgetRemaining = totalBudget - totalSpent;

  // Calculate category breakdown
  const categoryBreakdown = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = EXPENSE_CATEGORIES.find(cat => cat.id === transaction.category);
      const categoryName = category ? category.name : 'Other';
      acc[categoryName] = (acc[categoryName] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Calculate budget alerts
  const budgetAlerts = currentMonthBudgets.filter(budget => {
    const spent = currentMonthExpenses[budget.categoryId] || 0;
    return spent > budget.amount * 0.8; // Alert when 80% of budget is used
  }).length;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Personal Finance Tracker</h1>
          <p className="text-slate-600">Take control of your financial future with smart budgeting</p>
        </div>

        {/* Financial Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">
                ${totalIncome.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-800">
                ${totalExpenses.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow ${
            balance >= 0 ? 'border-blue-200' : 'border-orange-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                balance >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                Balance
              </CardTitle>
              <DollarSign className={`h-4 w-4 ${
                balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                balance >= 0 ? 'text-blue-800' : 'text-orange-800'
              }`}>
                ${balance.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow ${
            budgetRemaining >= 0 ? 'border-emerald-200' : 'border-red-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                budgetRemaining >= 0 ? 'text-emerald-700' : 'text-red-700'
              }`}>
                Budget Left
              </CardTitle>
              <Target className={`h-4 w-4 ${
                budgetRemaining >= 0 ? 'text-emerald-600' : 'text-red-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                budgetRemaining >= 0 ? 'text-emerald-800' : 'text-red-800'
              }`}>
                ${budgetRemaining.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">
                ${totalBudget.toLocaleString()} budgeted
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow ${
            budgetAlerts > 0 ? 'border-amber-200' : 'border-purple-200'
          }`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-sm font-medium ${
                budgetAlerts > 0 ? 'text-amber-700' : 'text-purple-700'
              }`}>
                Budget Alerts
              </CardTitle>
              <AlertTriangle className={`h-4 w-4 ${
                budgetAlerts > 0 ? 'text-amber-600' : 'text-purple-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                budgetAlerts > 0 ? 'text-amber-800' : 'text-purple-800'
              }`}>
                {budgetAlerts}
              </div>
              <div className="text-sm text-slate-600">
                {budgetAlerts > 0 ? 'Categories over 80%' : 'All on track'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Transaction Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Transaction
          </Button>
        </div>

        {/* Transaction Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
              <TransactionForm
                onSubmit={handleTransactionSubmit}
                onCancel={handleCloseForm}
                initialData={editingTransaction}
              />
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Monthly Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyChart transactions={transactions} />
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Expense Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoryChart transactions={transactions} />
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCategories.length > 0 ? (
                      topCategories.map(([category, amount]) => {
                        const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                        const categoryData = EXPENSE_CATEGORIES.find(cat => cat.name === category);
                        return (
                          <div key={category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: categoryData?.color || '#6b7280' }}
                              />
                              <div>
                                <p className="font-medium text-slate-900">{category}</p>
                                <p className="text-sm text-slate-500">{percentage}% of expenses</p>
                              </div>
                            </div>
                            <span className="font-semibold text-slate-900">
                              ${amount.toLocaleString()}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 text-slate-500">
                        No expense categories yet
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((transaction) => {
                      const categoryData = transaction.type === 'expense'
                        ? EXPENSE_CATEGORIES.find(cat => cat.id === transaction.category)
                        : INCOME_CATEGORIES.find(cat => cat.id === transaction.category);

                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: categoryData?.color || '#6b7280' }}
                            />
                            <div>
                              <p className="font-medium text-slate-900">{transaction.description}</p>
                              <p className="text-sm text-slate-500">
                                {categoryData?.name || 'Other'} • {new Date(transaction.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className={`font-semibold ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                    {transactions.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        No transactions yet. Add your first transaction to get started!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budgets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BudgetManager
                budgets={budgets}
                currentMonth={currentMonth}
                onMonthChange={setCurrentMonth}
                onAddBudget={addBudget}
                onDeleteBudget={deleteBudget}
              />
              <BudgetChart
                budgets={budgets}
                expenses={currentMonthExpenses}
                currentMonth={currentMonth}
              />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <SpendingInsights
              transactions={transactions}
              budgets={budgets}
              currentMonth={currentMonth}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  All Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TransactionList
                  transactions={transactions}
                  onEdit={handleEdit}
                  onDelete={deleteTransaction}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}