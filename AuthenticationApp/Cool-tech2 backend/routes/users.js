const express = require('express');
const { assignUserToOU, removeUserFromOU, changeUserRole, assignUserToDivision, removeUserFromDivision, listAllUsers} = require('../controllers/usersController'); // Import controller functions
const authMiddleware = require('../middleware/auth'); // Import authentication middleware
const router = express.Router(); // Create a new router instance

// Route to list all users, with authentication middleware
router.get('/', authMiddleware, listAllUsers);
// Route to assign a user to an Organizational Unit (OU), with authentication middleware
router.post('/:userId/ou/:ouId', authMiddleware, assignUserToOU);

// Route to remove a user from an Organizational Unit (OU), with authentication middleware
router.delete('/:userId/:ouId', authMiddleware, removeUserFromOU);

// Route to change the role of a user, with authentication middleware
router.put('/:userId/role', authMiddleware, changeUserRole);

// Route to assign a user to a division, with authentication middleware
router.post('/:userId/division/:divisionId', authMiddleware, assignUserToDivision);

// Route to remove a user from a division, with authentication middleware
router.delete('/:userId/division/:divisionId', authMiddleware, removeUserFromDivision);

// Export the router to be used in other parts of the application
module.exports = router;
