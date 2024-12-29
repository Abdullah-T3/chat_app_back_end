exports.createPost = async (req, res) => {
  const { content, user_id } = req.body;
  try {
    await db.execute(
      `INSERT INTO posts (content, user_id, created_at) VALUES (?, ?, NOW())`,
      [content, user_id]
    );
    res.json({ message: 'Post created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM posts');
    res.json(rows);  // Return all posts
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
