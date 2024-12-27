const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/:sender_id/:receiver_id', async (req, res) => {
  const { sender_id, receiver_id } = req.params;
  try {
    const [messages] = await db.query(
      'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)',
      [sender_id, receiver_id, receiver_id, sender_id]
    );
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const { sender_id, receiver_id, message_content, message_type } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO messages (sender_id, receiver_id, message_content, message_type) VALUES (?, ?, ?, ?)',
      [sender_id, receiver_id, message_content, message_type]
    );
    res.status(201).json({ message_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
