const express = require('express');
const cors = require('cors'); // Import the cors package
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const credentialsRoutes = require('./routes/credentials');
const usersRoutes = require('./routes/users');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Update this with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to the database
connectDB();

// Define API routes
app.use('/api/auth', authRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/users', usersRoutes);

// Set up the server to listen on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
