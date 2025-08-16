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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const user = await getUserFromToken(request);
    const { id } = params;
    const body = await request.json();

    const update: any = {};
    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.targetAmount !== undefined) update.targetAmount = parseFloat(body.targetAmount);
    if (body.targetDate !== undefined) update.targetDate = body.targetDate ? new Date(body.targetDate) : undefined;
    if (body.priority !== undefined) update.priority = Number(body.priority);
    if (body.savedAmount !== undefined) update.savedAmount = parseFloat(body.savedAmount);

    const goal = await Goal.findOneAndUpdate({ _id: id, userId: user.userId }, update, { new: true });
    if (!goal) return NextResponse.json({ error: 'Goal not found' }, { status: 404 });

    return NextResponse.json({ message: 'Goal updated', goal }, { status: 200 });
  } catch (error:any) {
    if (error.message === 'No token provided' || error.message === 'Invalid token') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Goal PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

