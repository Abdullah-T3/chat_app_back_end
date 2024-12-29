// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const {
  getMessagesByChatId,
  sendMessage,
  deleteMessage
} = require('../controllers/messageController');

// Route to get messages by chat ID
router.get('/:chat_id', getMessagesByChatId);

// Route to send a message
router.post('/', sendMessage);

// Route to delete a message
router.delete('/:id', deleteMessage);

module.exports = router;
