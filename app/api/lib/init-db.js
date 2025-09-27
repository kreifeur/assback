import { connectToDatabase } from './mongodb';

export async function createIndexes() {
  try {
    const { db } = await connectToDatabase();
    
    await db.collection('members').createIndex({ email: 1 }, { unique: true });
    await db.collection('members').createIndex({ membershipNumber: 1 }, { unique: true });
    await db.collection('members').createIndex({ status: 1 });
    await db.collection('members').createIndex({ expiryDate: 1 });
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
}

// Run this once to create indexes
// createIndexes();