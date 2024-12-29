const express = require('express');
const { createPost, getAllPosts, getPostById, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createPost);     // Create Post
router.get('/', authMiddleware, getAllPosts);     // Get All Posts
router.get('/:id', authMiddleware, getPostById);  // Get Post By ID
router.delete('/:id', authMiddleware, deletePost); // Delete Post

module.exports = router;
