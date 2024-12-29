const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,   // Should be mysql-mywork.alwaysdata.net
  user: process.env.DB_USER,   // Your database username
  password: process.env.DB_PASSWORD,   // Your database password
  database: process.env.DB_NAME,  // Your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1); // Exit if the connection fails
  } else {
    console.log('Connected to the database');
  }
});
