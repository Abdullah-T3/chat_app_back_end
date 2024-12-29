const express = require('express');
const router = express.Router();
const { createChat, getChats } = require('../controllers/chatController');

// Create a new chat
router.post('/', createChat);

// Get all chats for a user
router.get('/:userId', getChats);

module.exports = router;
