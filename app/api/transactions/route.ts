import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Transaction from '@/models/Transaction';

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

// GET - Fetch all transactions for the user
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    
    const transactions = await Transaction.find({ userId: user.userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json({ transactions }, { status: 200 });

  } catch (error: any) {
    console.error('Get transactions error:', error);
    
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

// POST - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const user = await getUserFromToken(request);
    const { amount, date, description, type, category } = await request.json();

    // Validation
    if (!amount || !date || !description || !type || !category) {
      return NextResponse.json(
        { error: 'Please fill in all fields' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either income or expense' },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = new Transaction({
      userId: user.userId,
      amount: parseFloat(amount),
      date: new Date(date),
      description: description.trim(),
      type,
      category
    });

    await transaction.save();

    return NextResponse.json(
      { 
        message: 'Transaction created successfully',
        transaction 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Create transaction error:', error);
    
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
