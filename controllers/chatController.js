const db = require('../db');

// Create a new chat
exports.createChat = async (req, res) => {
  const { user1_id, user2_id } = req.body;

  try {
    // Create chat in database
    const result = await db.query('INSERT INTO chats (user1_id, user2_id) VALUES (?, ?)', [user1_id, user2_id]);

    res.status(201).json({ chat_id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all chats for a user
exports.getChats = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get all chats for a user
    const chats = await db.query('SELECT * FROM chats WHERE user1_id = ? OR user2_id = ?', [userId, userId]);

    res.json(chats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
