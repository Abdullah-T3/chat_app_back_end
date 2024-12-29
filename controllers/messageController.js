exports.sendMessage = async (req, res) => {
    const { content, chat_id, receiver_id } = req.body;
    const sender_id = req.user.id;
    try {
      await db.execute('INSERT INTO messages (content, chat_id, receiver_id, sender_id, created_at) VALUES (?, ?, ?, ?, NOW())', 
        [content, chat_id, receiver_id, sender_id]);
      res.json({ message: 'Message sent' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  