const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

// Load environment variables from .env
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Could not connect to database:', err);
    process.exit(1);
  }
  console.log('Connected to the database');
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// -------------- SIGNUP --------------------
app.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    try {
      // Check if email already exists
      db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
          return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        db.query(
          'INSERT INTO users (email, username, password, created_at) VALUES (?, ?, ?, NOW())',
          [email, username, hashedPassword],
          (err, result) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to create user' });
            }
            res.status(201).json({ message: 'User created successfully' });
          }
        );
      });
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);
// -------------- GET ALL USERS --------------------
app.get('/users', verifyToken, (req, res) => {
  db.query('SELECT id, email, username, created_at FROM users', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.status(200).json(result);
  });
});

// -------------- LOGIN --------------------
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate request body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find user by email
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (result.length === 0) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const user = result[0];

      // Compare password with hashed password in DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Create JWT token
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------- CREATE POST --------------------
app.post('/posts', verifyToken, async (req, res) => {
  const { content } = req.body;
  const user_id = req.userId;

  // Validate request body
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // Insert new post into the database
    db.query(
      'INSERT INTO posts (content, user_id, created_at) VALUES (?, ?, NOW())',
      [content, user_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create post' });
        }
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
      }
    );
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------- GET ALL POSTS --------------------
app.get('/posts', verifyToken, (req, res) => {
  db.query('SELECT * FROM posts', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
    res.status(200).json(result);
  });
});

// -------------- CREATE MESSAGE --------------------
app.post('/messages', verifyToken, async (req, res) => {
  const { chat_id, content, receiver_id } = req.body;
  const sender_id = req.userId;

  // Validate request body
  if (!chat_id || !content || !receiver_id) {
    return res.status(400).json({ error: 'Chat ID, content, and receiver ID are required' });
  }

  try {
    // Insert new message into the database
    db.query(
      'INSERT INTO messages (content, chat_id, sender_id, receiver_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [content, chat_id, sender_id, receiver_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to send message' });
        }
        res.status(201).json({ message: 'Message sent successfully', messageId: result.insertId });
      }
    );
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// -------------- GET MESSAGES --------------------
app.get('/messages', verifyToken, (req, res) => {
  const { chat_id } = req.query;

  if (!chat_id) {
    return res.status(400).json({ error: 'Chat ID is required' });
  }

  db.query('SELECT * FROM messages WHERE chat_id = ?', [chat_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch messages' });
    }
    res.status(200).json(result);
  });
});

// -------------- START SERVER --------------------
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
