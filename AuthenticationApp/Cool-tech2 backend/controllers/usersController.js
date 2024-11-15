const User = require('../models/User');
const OU = require('../models/OU');
const Division = require('../models/Division');

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Assign User to OU
exports.assignUserToOU = [isAdmin, async (req, res) => {
  const { userId, ouId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Populate divisions within the OU to get their details
    const ou = await OU.findById(ouId).populate('divisions');
    if (!ou) return res.status(404).json({ message: 'OU not found' });

    // Add user to each division's employees array if not already present
    const divisionPromises = ou.divisions.map(async (division) => {
      if (!division.employees.includes(userId)) {
        division.employees.push(userId);
        await division.save();
      }
    });

    await Promise.all(divisionPromises);

    res.json(ou);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}];


// Unassign User from OU
exports.removeUserFromOU = [isAdmin, async (req, res) => {
  const { userId, ouId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Populate divisions within the OU to get their details
    const ou = await OU.findById(ouId).populate('divisions');
    if (!ou) return res.status(404).json({ message: 'OU not found' });

    // Remove user from each division's employees array
    const divisionPromises = ou.divisions.map(async (division) => {
      if (division.employees.includes(userId)) {
        division.employees = division.employees.filter(id => id.toString() !== userId);
        await division.save();
      }
    });

    await Promise.all(divisionPromises);

    res.json({ message: 'User removed from OU and associated divisions successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}];

// Change User Role
exports.changeUserRole = [isAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user's role
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}];

// Assign User to Division
exports.assignUserToDivision = [isAdmin, async (req, res) => {
  const { userId, divisionId } = req.params;

  try {
    const user = await User.findById(userId);
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const division = await Division.findById(divisionId);

  
    if (!division) return res.status(404).json({ error: 'Division not found' });

    // Add user to division's employees list if not already present
    if (!division.employees.includes(userId)) {
      division.employees.push(userId);
      await division.save();
    }

    res.json({ message: 'User assigned to division successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}];

// Remove User from Division
exports.removeUserFromDivision = [isAdmin, async (req, res) => {
  const { userId, divisionId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    
    const division = await Division.findById(divisionId);
    
    if (division) {
      // Remove user from division's employees list
      division.employees = division.employees.filter(id => id.toString() !== userId);
      await division.save();
    }

    res.json({ message: 'User removed from division successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
}];

// List All Users
exports.listAllUsers = [isAdmin, async (req, res) => {
  try {
    const users = await User.find(); // Assuming you want to populate related OUs and divisions if they are references
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}];

