import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({ 
        error: 'MONGODB_URI is missing from environment variables' 
      }, { status: 500 });
    }

    console.log('Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ MongoDB connected successfully!');
    
    // Get database info
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    // Check if users collection exists and get sample data
    let users = [];
    if (collectionNames.includes('users')) {
      users = await db.collection('users').find().limit(5).toArray();
    }

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      collections: collectionNames,
      totalUsers: users.length,
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        // Don't show password for security
      })),
      connectionInfo: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      connectionString: process.env.MONGODB_URI ? 'Exists (hidden for security)' : 'Missing',
      suggestion: 'Check your password and whitelist IP in MongoDB Atlas'
    }, { status: 500 });
  }
}