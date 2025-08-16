import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Account from '@/models/Account';

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
    const accounts = await Account.find({ userId: user.userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ accounts }, { status: 200 });
  } catch (error: any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Accounts GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);
    const { name, type, openingBalance, currency } = await request.json();

    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type are required' }, { status: 400 });
    }

    const account = new Account({
      userId: user.userId,
      name: String(name).trim(),
      type,
      openingBalance: openingBalance ? parseFloat(openingBalance) : 0,
      currency: currency || 'INR',
    });

    await account.save();
    return NextResponse.json({ message: 'Account created', account }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Accounts POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

