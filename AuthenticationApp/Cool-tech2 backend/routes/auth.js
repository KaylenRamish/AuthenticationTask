const express = require('express');
const { register, login } = require('../controllers/authController'); // Import controller functions for authentication
const router = express.Router(); // Create a new router instance

// Route to handle user registration
router.post('/register', register);

// Route to handle user login
router.post('/login', login);

// Export the router to be used in other parts of the application
module.exports = router;
