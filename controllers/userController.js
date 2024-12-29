const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute('INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)', 
      [email, hashedPassword, first_name, last_name]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, users[0].password);
    if (!validPassword) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get User By ID
exports.getUserById = async (req, res) => {
  try {
    const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user.length) return res.status(404).json({ message: 'User not found' });
    res.json(user[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
