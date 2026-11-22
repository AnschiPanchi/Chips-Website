import mongoose from "mongoose";

let cachedPromise = null;

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI not set in environment variables");

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((conn) => {
        console.log("🍃  MongoDB connected");
        return conn;
      })
      .catch((err) => {
        cachedPromise = null;
        console.error("❌  MongoDB connection error:", err.message);
        throw err;
      });
  }

  return cachedPromise;
}
