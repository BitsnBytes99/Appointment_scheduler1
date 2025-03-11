const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.signup = async (req, res) => {
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
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user by email
    const [userResult] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    // Ensure user exists
    if (userResult.length === 0) return res.status(401).json({ message: "❌ Invalid credentials" });

    const user = userResult[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "❌ Invalid credentials" });

    // Redirect to homepage
    console.log("Login Success");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Login failed!" });
  }
};
