const express = require('express');
const mysql = require('mysql2');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'zagdb_chat',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('Connected to the database.');
});

// Helper function for validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes

// Users
app.post(
  '/users',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('username').notEmpty().withMessage('Username is required'),
  ],
  validate,
  (req, res) => {
    const { email, password, username } = req.body;
    db.query(
      'INSERT INTO users (email, password, username, created_at) VALUES (?, ?, ?, NOW())',
      [email, password, username],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
      }
    );
  }
);

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Posts
app.post(
  '/posts',
  [
    body('content').notEmpty().withMessage('Content is required'),
    body('user_id').isUUID().withMessage('Invalid user ID format'),
  ],
  validate,
  (req, res) => {
    const { content, user_id } = req.body;
    db.query(
      'INSERT INTO posts (content, user_id, created_at) VALUES (?, ?, NOW())',
      [content, user_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Post created successfully', postId: result.insertId });
      }
    );
  }
);

app.get('/posts', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Chats
app.post(
  '/chats',
  [
    body('user_one').isUUID().withMessage('Invalid user_one ID format'),
    body('user_two').isUUID().withMessage('Invalid user_two ID format'),
  ],
  validate,
  (req, res) => {
    const { user_one, user_two } = req.body;
    db.query(
      'INSERT INTO chats (user_one, user_two) VALUES (?, ?)',
      [user_one, user_two],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Chat created successfully', chatId: result.insertId });
      }
    );
  }
);

app.get('/chats', (req, res) => {
  db.query('SELECT * FROM chats', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Messages
app.post(
  '/messages',
  [
    body('content').notEmpty().withMessage('Message content is required'),
    body('chat_id').isUUID().withMessage('Invalid chat ID format'),
    body('sender_id').isUUID().withMessage('Invalid sender ID format'),
    body('receiver_id').isUUID().withMessage('Invalid receiver ID format'),
  ],
  validate,
  (req, res) => {
    const { content, chat_id, sender_id, receiver_id } = req.body;
    db.query(
      'INSERT INTO messages (content, chat_id, sender_id, receiver_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [content, chat_id, sender_id, receiver_id],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Message sent successfully', messageId: result.insertId });
      }
    );
  }
);

app.get('/messages', (req, res) => {
  db.query('SELECT * FROM messages', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
