exports.createPost = async (req, res) => {
    const { content } = req.body;
    const user_id = req.user.id;
    try {
      await db.execute('INSERT INTO posts (content, user_id, created_at) VALUES (?, ?, NOW())', [content, user_id]);
      res.json({ message: 'Post created' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  