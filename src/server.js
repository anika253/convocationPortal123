// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import authRoute from "./Routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Use the authentication routes
app.use("/api/auth", authRoute);

// Connect to MongoDB using your connection string from .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
