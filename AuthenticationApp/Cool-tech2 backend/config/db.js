const mongoose = require('mongoose');
require('dotenv').config();

// Function to connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    // Construct MongoDB URI from environment variables for better security
    const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      // Options can be added here if needed
    });

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure if connection fails
  }
};

module.exports = connectDB;
