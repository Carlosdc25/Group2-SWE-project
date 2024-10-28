import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connection.js";
import records from "./routes/record.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); 
app.use(express.json());
app.use("/record", records);
app.use("/auth", authRoutes);

  mongoose.connect(process.env.ATLAS_URI)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Test query to verify database location and collection
    const testUser = await mongoose.connection.db.collection('userinfo').findOne({ username: "user" });
    console.log("Test user found in userinfo collection:", testUser);
  })
  .catch(err => console.error("Database connection error:", err));

// Connect to the database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
