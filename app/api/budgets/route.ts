import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Budget from '@/models/Budget';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// GET - Fetch all budgets for the user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    
    const budgets = await Budget.find({ userId: user.userId })
      .sort({ month: -1 })
      .lean();

    return NextResponse.json({ budgets }, { status: 200 });

  } catch (error: any) {
    console.error('Get budgets error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new budget
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    const { categoryId, amount, month } = await request.json();

    // Validation
    if (!categoryId || !amount || !month) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    if (amount < 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than or equal to 0' },
        { status: 400 }
      );
    }

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }

    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      userId: user.userId,
      categoryId,
      month
    });

    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = parseFloat(amount);
      await existingBudget.save();

      return NextResponse.json(
        { 
          message: 'Budget updated successfully',
          budget: existingBudget 
        },
        { status: 200 }
      );
    } else {
      // Create new budget
      const budget = new Budget({
        userId: user.userId,
        categoryId,
        amount: parseFloat(amount),
        month
      });

      await budget.save();

      return NextResponse.json(
        { 
          message: 'Budget created successfully',
          budget 
        },
        { status: 201 }
      );
    }

  } catch (error: any) {
    console.error('Create budget error:', error);
    
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
