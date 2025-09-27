import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      return NextResponse.json({ 
        error: 'MONGODB_URI missing from .env.local',
        example: 'mongodb+srv://username:password@cluster.mongodb.net/database'
      });
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Check if users collection exists and get sample data
    let usersSample = [];
    if (collectionNames.includes('users')) {
      usersSample = await mongoose.connection.db.collection('users').find().limit(3).toArray();
    }
    
    return NextResponse.json({
      success: true,
      database: mongoose.connection.db.databaseName,
      collections: collectionNames,
      usersSample: usersSample,
      connectionString: MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') // Hide credentials
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      connectionString: process.env.MONGODB_URI ? 'Exists (hidden)' : 'Missing'
    });
  }
}