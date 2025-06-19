const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
// Adjust path if needed

// Route imports
const studentRoutes = require("./Routes/studentRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const authRoutes = require("./Routes/authRoutes");
const documentRoutes = require("./Routes/DocumentRoutes");
const geminiRoutes = require("./Routes/gemini");

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://convocation-portal123.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/student", studentRoutes);
app.use("/api/gemini", geminiRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// Default route or 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// MongoDB connection & server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
