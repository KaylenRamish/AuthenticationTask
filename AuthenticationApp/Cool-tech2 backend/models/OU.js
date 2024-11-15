const mongoose = require('mongoose');

// Define the schema for the Organizational Unit (OU) model
const ouSchema = new mongoose.Schema({
  // Unique name of the organizational unit
  name: { type: String, required: true, unique: true },
  
  // Array of divisions associated with the OU, referenced by Division model
  divisions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Division' }]
});

// Export the OU model based on the schema
module.exports = mongoose.model('OU', ouSchema);
