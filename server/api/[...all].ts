// api/handler.ts  ← or wherever you put it
import app from "../src/index.js";
import { connectDb } from "../src/config/db.js";

// This makes sure DB connects only once per container (cold start)
let isConnected = false;

export default async function handler(req: any, res: any) {
  if (!isConnected) {
    console.log("Cold start → Connecting to MongoDB...");
    await connectDb(); // ← This fixes all connection issues
    isConnected = true;
    console.log("MongoDB connected!");
  }

  // Now safely pass the request to your Express app
  return app(req, res);
}
