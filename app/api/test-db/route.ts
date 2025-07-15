import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Test database connection by counting users
    const userCount = await User.countDocuments();
    
    return NextResponse.json({
      message: 'Database connection successful!',
      userCount: userCount,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error('Database connection error:', error);
    return NextResponse.json({
      error: 'Database connection failed',
      details: error.message
    }, { status: 500 });
  }
}
