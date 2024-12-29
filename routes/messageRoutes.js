const express = require('express');
const { sendMessage, getMessagesByChatId, deleteMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, sendMessage);          // Send Message
router.get('/:chatId', authMiddleware, getMessagesByChatId); // Get Messages in a Chat
router.delete('/:id', authMiddleware, deleteMessage);   // Delete Message

module.exports = router;
