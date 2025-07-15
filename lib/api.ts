// API utility functions for making requests to the backend

export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  categoryId: string;
  amount: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction API functions
export const transactionAPI = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    const response = await fetch('/api/transactions', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch transactions');
    }

    const data = await response.json();
    return data.transactions;
  },

  // Create a new transaction
  create: async (transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create transaction');
    }

    const data = await response.json();
    return data.transaction;
  },

  // Update a transaction
  update: async (id: string, transaction: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update transaction');
    }

    const data = await response.json();
    return data.transaction;
  },

  // Delete a transaction
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete transaction');
    }
  }
};

// Budget API functions
export const budgetAPI = {
  // Get all budgets
  getAll: async (): Promise<Budget[]> => {
    const response = await fetch('/api/budgets', {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch budgets');
    }

    const data = await response.json();
    return data.budgets;
  },

  // Create or update a budget
  createOrUpdate: async (budget: Omit<Budget, '_id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
    const response = await fetch('/api/budgets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(budget),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create/update budget');
    }

    const data = await response.json();
    return data.budget;
  },

  // Delete a budget
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/budgets/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete budget');
    }
  }
};
