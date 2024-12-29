const express = require('express');
const { registerUser, loginUser, getAllUsers, getUserById, deleteUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);   // Register User
router.post('/login', loginUser);         // Login User
router.get('/', authMiddleware, getAllUsers);  // Get All Users
router.get('/:id', authMiddleware, getUserById); // Get User By ID
router.delete('/:id', authMiddleware, deleteUser); // Delete User

module.exports = router;
