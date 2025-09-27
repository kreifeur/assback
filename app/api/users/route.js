import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';

export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find({}).select('-password').limit(10);
    const totalUsers = await User.countDocuments();
    
    return NextResponse.json({
      success: true,
      totalUsers,
      users: users
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}