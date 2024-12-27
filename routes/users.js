const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', async (req, res) => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new user
router.post('/', async (req, res) => {
  const { username, email, password_hash, profile_picture_url } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO users (username, email, password_hash, profile_picture_url) VALUES (?, ?, ?, ?)',
      [username, email, password_hash, profile_picture_url]
    );
    res.status(201).json({ user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
