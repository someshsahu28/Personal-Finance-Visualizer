'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Trash2, Target, AlertCircle } from 'lucide-react';
import { Budget } from '@/app/page';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

interface BudgetManagerProps {
  budgets: Budget[];
  currentMonth: string;
  onMonthChange: (month: string) => void;
  onAddBudget: (budget: Omit<Budget, 'id'>) => void;
  onDeleteBudget: (id: string) => void;
}

export function BudgetManager({ 
  budgets, 
  currentMonth, 
  onMonthChange, 
  onAddBudget, 
  onDeleteBudget 
}: BudgetManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currentMonthBudgets = budgets.filter(b => b.month === currentMonth);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedCategory) {
      newErrors.category = 'Category is required';
    }

    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      newErrors.amount = 'Budget amount must be greater than 0';
    }

    const existingBudget = currentMonthBudgets.find(b => b.categoryId === selectedCategory);
    if (existingBudget) {
      newErrors.category = 'Budget already exists for this category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onAddBudget({
      categoryId: selectedCategory,
      amount: parseFloat(budgetAmount),
      month: currentMonth,
    });

    setSelectedCategory('');
    setBudgetAmount('');
    setErrors({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      onDeleteBudget(id);
    }
  };

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
  
    for (let i = -6; i <= 5; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value: monthKey, label: monthName });
    }
    
    return options;
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(
    cat => !currentMonthBudgets.some(b => b.categoryId === cat.id)
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Budget Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Month Selector */}
        <div className="space-y-2">
          <Label>Select Month</Label>
          <Select value={currentMonth} onValueChange={onMonthChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {generateMonthOptions().map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Add Budget Form */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-medium text-slate-900">Add New Budget</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      <div className="flex items-center space-x-2">
                        <span>{cat.icon}</span>
                        <span>{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Budget Amount (₹)</Label>
              <Input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                placeholder="0.00"
                className={errors.amount ? 'border-red-500' : ''}
              />
              {errors.amount && (
                <div className="flex items-center space-x-1 text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.amount}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={availableCategories.length === 0}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
          
          {availableCategories.length === 0 && (
            <p className="text-sm text-slate-500 text-center">
              All categories have budgets for this month
            </p>
          )}
        </form>

        {/* Current Budgets */}
        <div className="space-y-3">
          <h3 className="font-medium text-slate-900">
            Current Budgets ({new Date(currentMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
          </h3>
          
          {currentMonthBudgets.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No budgets set for this month
            </div>
          ) : (
            <div className="space-y-2">
              {currentMonthBudgets.map(budget => {
                const category = EXPENSE_CATEGORIES.find(cat => cat.id === budget.categoryId);
                return (
                  <div
                    key={budget.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category?.color || '#6b7280' }}
                      />
                      <div>
                        <p className="font-medium text-slate-900">
                          {category?.name || 'Unknown Category'}
                        </p>
                        <p className="text-sm text-slate-500">
                          Monthly budget
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="font-semibold">
                        ₹{budget.amount.toLocaleString()}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}