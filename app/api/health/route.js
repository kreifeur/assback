import { connectToDatabase } from '../lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    // Test database connection
    await db.command({ ping: 1 });

    return Response.json({
      status: 'OK',
      message: 'Server and database are running correctly',
      timestamp: new Date().toISOString(),
      database: 'connected'
    });

  } catch (error) {
    return Response.json({
      status: 'Error',
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// Optional: Also handle POST requests if needed
export async function POST(request) {
  return Response.json({
    message: 'POST method not implemented for health check',
    timestamp: new Date().toISOString()
  }, { status: 405 });
}