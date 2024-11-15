const express = require('express');
const { getCredentials, addCredential, updateCredential, listAllOUs, listAllDivisions, getUsersByOUAndDivisionsForAdmin} = require('../controllers/credentialsController'); // Import controller functions
const authMiddleware = require('../middleware/auth'); // Import authentication middleware
const router = express.Router(); // Create a new router instance

// Route to get credentials for a specific division, with authentication middleware
router.get('/cred/:divisionId', authMiddleware, getCredentials);

// Route to add a new credential for a specific division, with authentication middleware
router.post('/cred/:divisionId', authMiddleware, addCredential);

// Route to update a specific credential within a division, with authentication middleware
router.put('/cred/:divisionId/:credentialId', authMiddleware, updateCredential);

// Route to list all OUs with their IDs and names, with authentication middleware
router.get('/ous', authMiddleware, listAllOUs);

// Route to list all Divisions with their IDs and names, with authentication middleware
router.get('/divisions', authMiddleware, listAllDivisions);

router.get('/admin/users-ou-divisions', authMiddleware, getUsersByOUAndDivisionsForAdmin);

// Export the router to be used in other parts of the application
module.exports = router;
