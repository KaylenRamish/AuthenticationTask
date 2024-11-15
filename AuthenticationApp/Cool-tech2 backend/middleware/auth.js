const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate requests using JWT
const authMiddleware = async (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if token is provided
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user associated with the token
    req.user = await User.findById(decoded.id);
    
    // Check if user exists
    if (!req.user) return res.status(401).json({ message: 'Invalid token' });

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle errors (e.g., invalid token)
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
