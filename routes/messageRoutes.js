const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');
const auth = require('../middleware/auth');  
// POST route for sending messages
router.post('/', auth, sendMessage);

// Test GET route (Optional)
router.get('/test', (req, res) => {
  res.send('Message route is working');
});

module.exports = router;
