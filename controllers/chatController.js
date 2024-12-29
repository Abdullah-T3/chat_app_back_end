const db = require('../config/db');

// Create Chat
exports.createChat = async (req, res) => {
  const { user_two } = req.body;
  const user_one = req.user.id;
  try {
    await db.execute('INSERT INTO chats (user_one, user_two) VALUES (?, ?)', [user_one, user_two]);
    res.status(201).json({ message: 'Chat created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get User Chats
exports.getUserChats = async (req, res) => {
  try {
    const [chats] = await db.execute('SELECT * FROM chats WHERE user_one = ? OR user_two = ?', [req.user.id, req.user.id]);
    res.json(chats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Chat By ID
exports.getChatById = async (req, res) => {
  try {
    const [chat] = await db.execute('SELECT * FROM chats WHERE chat_id = ?', [req.params.id]);
    res.json(chat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Chat
exports.deleteChat = async (req, res) => {
  try {
    await db.execute('DELETE FROM chats WHERE chat_id = ?', [req.params.id]);
    res.json({ message: 'Chat deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
