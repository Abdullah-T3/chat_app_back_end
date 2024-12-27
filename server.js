const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Import body-parser for parsing JSON
require('dotenv').config(); // Load environment variables from .env file
const db = require('./db'); // Import database connection

const app = express(); // Initialize the Express app

const PORT = process.env.PORT || 3000; // Set the port

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Import routes
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');

// Test route
app.get('/', (req, res) => {
  res.send('Chat App API is running');
});

// Use routes after app initialization
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
