import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Fixed function name to match your import
export default async function connectDB() {
  if (cached.conn) {
    console.log("🔄 Using cached database connection");
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = { 
      bufferCommands: false,
      // Add these options for better connection handling
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("🔄 Creating new database connection...");
    
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        console.log("✅ Database Connected Successfully");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ Database Connection Failed:", err);
        cached.promise = null; // Reset promise on failure
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null; // Reset promise on failure
    throw err;
  }
}