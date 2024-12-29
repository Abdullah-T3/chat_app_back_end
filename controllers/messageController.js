const db = require('../db');

// Send a message
exports.sendMessage = async (req, res) => {
  const { content, chat_id, receiver_id } = req.body;
  const sender_id = req.user.id; // Assuming authentication middleware populates `req.user`

  try {
    await db.query('INSERT INTO messages (content, chat_id, receiver_id, sender_id, created_at) VALUES (?, ?, ?, ?, NOW())',
      [content, chat_id, receiver_id, sender_id]);
    res.json({ message: 'Message sent' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get messages for a specific chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await db.query('SELECT * FROM messages WHERE chat_id = ?', [chatId]);
    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
