const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { SECRET_KEY } = require("../../backend/config/db");

// Signup API
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role = "customer" } = req.body;

    // Check if user exists
    const [existingUser] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) return res.status(400).json({ message: "❌ User already exists!" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    await db.promise().query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role]);

    res.status(201).json({ message: "✅ User Registered!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Signup failed!" });
  }
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email
    const [userResult] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (userResult.length === 0) return res.status(401).json({ message: "❌ Invalid credentials" });

    const user = userResult[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "❌ Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "2h" });

    res.json({ message: "✅ Login successful", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Login failed!" });
  }
});

module.exports = router;
