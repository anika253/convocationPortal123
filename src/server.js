const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const users = []; // Temporary storage (Replace with DB)
const SECRET_KEY = "your_secret_key"; // Use .env for security

// Register Route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ name, email, password: hashedPassword });
  res.json({ message: "User registered successfully!" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

// Protected Route
app.get("/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: req.user });
});

// Middleware for Token Verification
function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

app.listen(5000, () => console.log("Server running on port 5000"));
