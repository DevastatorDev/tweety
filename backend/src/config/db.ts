import mongoose from "mongoose";
import { DB_URI } from "./env";

export const connectDb = async () => {
  try {
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log("MONGODB CONNECTION ERROR :: ", error);
    process.exit(1);
  }
};
