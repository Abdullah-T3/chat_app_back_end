exports.sendMessage = async (req, res) => {
  const { content, chat_id, receiver_id } = req.body;
  const sender_id = req.user?.id;

  if (!content || !chat_id || !receiver_id || !sender_id) {
    return res.status(400).json({ error: 'Missing required fields: content, chat_id, receiver_id, sender_id' });
  }

  try {
    await db.execute(
      `INSERT INTO messages (content, chat_id, receiver_id, sender_id, created_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [content, chat_id, receiver_id, sender_id]
    );

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('Error in sendMessage:', err.message);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
