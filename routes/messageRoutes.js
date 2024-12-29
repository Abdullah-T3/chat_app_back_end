const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');

// Send a message
router.post('/', sendMessage);

// Get messages for a specific chat
router.get('/:chatId', getMessages);

module.exports = router;
