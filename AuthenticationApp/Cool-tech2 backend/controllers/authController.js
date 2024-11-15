const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  const { email, firstname, lastname, password } = req.body;
  try {

    const hashedPassword = await bcrypt.hash(password, 10);  // Hash the password
    const user = new User({ email, firstname, lastname, password: hashedPassword });
    await user.save();  // Save user to database
    res.status(201).json({ id: user._id, email, firstname, lastname, role: user.role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);  // Compare hashed passwords
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
