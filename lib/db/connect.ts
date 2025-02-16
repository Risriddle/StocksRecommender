"use server"

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    console.log("Mongoose Import:===========================================", mongoose); // Debugging

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: true,
      })
      .then((mongoose) => {
        console.log("MongoDB Connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

(global as any).mongoose = cached;
export default dbConnect;













