const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { SECRET_KEY } = require("../config/db"); // Importing secret key from config file

// Middleware to Verify Admin Role
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== "admin") return res.status(403).json({ message: "Access Denied: Admins Only" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Fetch All Users (Admin Only)
router.get("/users", verifyAdmin, (req, res) => {
  db.query("SELECT id, name, email, role FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Database Error" });
    res.json(results);
  });
});

// Admin Dashboard Route
router.get("/admin", verifyAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard" });
});

module.exports = router;
