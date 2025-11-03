import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const url = process.env.MONGO_DB_URL as string;
const Password = process.env.PASSWORD;

export const connectDb = async () => {
  if (!Password) {
    console.log("somthing wrong");
    return;
  }
  const MONGO_DB_URL = url?.replace("<db_password>", Password);
  try {
    const db = await mongoose.connect(MONGO_DB_URL);
    console.log(`✅ MongoDB connected: ${db.connection.host}`);
  } catch (error) {
    console.log("Error", error);
    process.exit(1);
  }
};
