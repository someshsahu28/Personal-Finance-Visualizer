import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Transfer from '@/models/Transfer';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) throw new Error('No token provided');
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    return decoded;
  } catch (e) {
    throw new Error('Invalid token');
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);
    const transfers = await Transfer.find({ userId: user.userId }).sort({ date: -1 }).lean();
    return NextResponse.json({ transfers }, { status: 200 });
  } catch (error:any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Transfers GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);
    const { fromAccountId, toAccountId, amount, date, note } = await request.json();

    if (!fromAccountId || !toAccountId || !amount || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (fromAccountId === toAccountId) {
      return NextResponse.json({ error: 'From/To cannot be same account' }, { status: 400 });
    }

    const transfer = new Transfer({
      userId: user.userId,
      fromAccountId,
      toAccountId,
      amount: parseFloat(amount),
      date: new Date(date),
      note: note?.trim(),
    });
    await transfer.save();

    return NextResponse.json({ message: 'Transfer recorded', transfer }, { status: 201 });
  } catch (error:any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Transfers POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

