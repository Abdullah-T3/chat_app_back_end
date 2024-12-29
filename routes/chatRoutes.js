const express = require('express');
const { createChat, getUserChats, getChatById, deleteChat } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createChat);     // Create Chat
router.get('/', authMiddleware, getUserChats);    // Get All Chats of a User
router.get('/:id', authMiddleware, getChatById);  // Get Chat By ID
router.delete('/:id', authMiddleware, deleteChat); // Delete Chat

module.exports = router;
