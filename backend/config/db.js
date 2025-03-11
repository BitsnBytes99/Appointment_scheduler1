const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "s@tya2005",
  database: "appointment_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err);
  } else {
    console.log("MySQL Connected...");
  }
});

module.exports = {
  SECRET_KEY: "d6b8d6378fe940af9f335422b84c0da325eaa641e40d4aa920b0a53c31da9622", // Secure secret key
};

module.exports = db;
