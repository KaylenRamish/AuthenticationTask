const mongoose = require('mongoose');

// Define the schema for the Division model
const divisionSchema = new mongoose.Schema({
  // Unique name of the division
  name: { type: String, required: true, unique: true },
  
  // Array of repositories associated with the division
  repo: [{
    name: String,           // Name of the repository
    url: String,            // URL of the repository
    userName: String,       // Username for accessing the repository
    password: String,       // Password for accessing the repository
    description: String     // Description of the repository
  }],
  
  // Array of employees associated with the division, referenced by User model
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Export the Division model based on the schema
module.exports = mongoose.model('Division', divisionSchema);
