const express = require('express');
const router = express.Router();
const { createPost, getPosts } = require('../controllers/postController');  // Importing functions from controller

// POST route to create a new post
router.post('/', createPost);

// GET route to fetch all posts
router.get('/', getPosts);

module.exports = router;
