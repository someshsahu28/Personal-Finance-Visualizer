import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Goal from '@/models/Goal';

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
    const goals = await Goal.find({ userId: user.userId }).sort({ priority: 1, createdAt: -1 }).lean();
    return NextResponse.json({ goals }, { status: 200 });
  } catch (error: any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Goals GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);
    const { name, targetAmount, targetDate, priority } = await request.json();

    if (!name || targetAmount === undefined) {
      return NextResponse.json({ error: 'Name and targetAmount are required' }, { status: 400 });
    }

    const goal = new Goal({
      userId: user.userId,
      name: String(name).trim(),
      targetAmount: parseFloat(targetAmount),
      targetDate: targetDate ? new Date(targetDate) : undefined,
      priority: priority ? Number(priority) : 3,
      savedAmount: 0,
    });

    await goal.save();
    return NextResponse.json({ message: 'Goal created', goal }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Goals POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

