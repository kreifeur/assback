import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

// Validate only the essential environment variable
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Get database name from URI or use default
const getDatabaseName = () => {
  // First try to get from environment variable
  if (process.env.MONGODB_DB) {
    return process.env.MONGODB_DB;
  }
  
  // Try to extract from connection string
  try {
    const url = new URL(MONGODB_URI);
    const dbName = url.pathname.replace('/', '');
    return dbName || 'cosmeto-assoc';
  } catch (error) {
    // If URI parsing fails, use default
    return 'cosmeto-assoc';
  }
};

const MONGODB_DB = getDatabaseName();

console.log('📊 Using database:', MONGODB_DB);

let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      };
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}