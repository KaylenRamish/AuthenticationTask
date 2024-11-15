const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  // User's email address, required field
  email: { type: String, required: true },
  
  // User's first name, required field
  firstname: { type: String, required: true },
  
  // User's last name, required field
  lastname: { type: String, required: true },
  
  // User's password, required field
  password: { type: String, required: true },
  
  // User's role with predefined values: 'normal', 'management', 'admin'
  // Default is set to 'normal'
  role: { type: String, enum: ['normal', 'management', 'admin'], default: 'normal' }
});

// Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
