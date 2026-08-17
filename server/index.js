require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://iuapoorva_db_user:qJJdpr6OiKFtA9Gj@cluster0.v00jzlr.mongodb.net/taskdb?retryWrites=true&w=majority&appName=Cluster0";
const JWT_KEY = process.env.JWT_SECRET || "taskmanagerjwtsecret123";

// MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.error("DB Error:", err));

// Database Schemas
const User = mongoose.model("User", new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

const Task = mongoose.model("Task", new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ["Work", "Personal", "Study", "Urgent"], default: "Work" },
  status: { type: String, enum: ["Todo", "In Progress", "Completed"], default: "Todo" },
  createdAt: { type: Date, default: Date.now }
}));

// Auth Middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized access" });
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Authentication Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_KEY, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Task Management Routes
app.get("/api/tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/tasks", auth, async (req, res) => {
  try {
    const task = await Task.create({ ...req.body, user: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put("/api/tasks/:id", auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/api/tasks/:id", auth, async (req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));