const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const studentRoutes = require("./Routes/studentRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const authRoutes = require("./Routes/authRoutes");
const documentRoutes = require("./Routes/DocumentRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploads folder statically to access uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Existing API routes
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// New route for document uploads
app.use("/api/docs", documentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
