const Division = require('../models/Division');
const User = require('../models/User');
const OU = require('../models/OU');

// // Middleware to check if the user is an admin
// const isAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied' });
//   }
//   next();
// };


// Fetch all users from OUs and their divisions when the user's role is 'admin'
exports.getUsersByOUAndDivisionsForAdmin = async (req, res) => {
  const userRole = req.user.role; // Assume req.user.role is set from your authentication middleware

  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }

  try {
    // Fetch all OUs
    const ous = await OU.find()
      .populate({
        path: 'divisions',
        populate: {
          path: 'employees',
          select: '_id firstname lastname email role', // Populate users from the divisions
        },
        select: '_id name employees', // Include division name and employees
      })
      .exec();

    // Prepare the response with OUs, divisions, and their employees
    const result = ous.map(ou => ({
      ouName: ou.name,
      divisions: ou.divisions.map(division => ({
        divisionName: division.name,
        employees: division.employees, // List all employees in the division
      })),
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching users by OU and divisions for admin:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get credentials for a division
exports.getCredentials = async (req, res) => {
  const { divisionId } = req.params;
  const userId = req.user._id;  // User ID from authentication middleware
  const userRole = req.user.role;  // User role from authentication middleware

  try {

    // Fetch the division details and its associated OU
    const division = await Division.findById(divisionId)
      .populate({
        path: 'employees',
        select: '_id firstname lastname email role' // Populate employee details
      })
      .exec();

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    // Fetch the OU associated with the division
    const ou = await OU.findOne({ divisions: divisionId })
      .populate({
        path: 'divisions',
        populate: {
          path: 'employees',
          select: '_id firstname lastname email' // Populate employee details
        }
      })
      .exec();

    if (!ou) {
      return res.status(404).json({ message: 'OU not found' });
    }

    // Check if the user is an employee in the division
    const isEmployeeInDivision = division.employees.some(employee => employee._id.toString() === userId.toString());
    // Check if the user is part of the OU's divisions
    const isEmployeeInOU = ou.divisions.some(div => div._id.toString() === divisionId && div.employees.some(employee => employee._id.toString() === userId.toString()));

    if (!isEmployeeInDivision && !isEmployeeInOU) {
      division.repo = [];  // Hide credentials if user is not an employee
    }

    res.json(division);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Add a new credential to a division
exports.addCredential = async (req, res) => {
  const { divisionId } = req.params;
  const { name, url, userName, password, description } = req.body;
  try {
    const division = await Division.findById(divisionId);
    if (!division) return res.status(404).json({ message: 'Division not found' });

    // Add new credential to division's repo
    division.repo.push({ name, url, userName, password, description });
    await division.save();  // Save changes to division
    res.status(201).json(division);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a credential in a division
exports.updateCredential = async (req, res) => {
  const { divisionId, credentialId } = req.params;
  const { name, url, userName, password, description } = req.body;
  try {
    const userRole = req.user.role; // Assume req.user.role is set from your authentication middleware
    if(userRole!=="normal"){
      const division = await Division.findById(divisionId);
      if (!division) return res.status(404).json({ message: 'Division not found' });
  
      const credential = division.repo.id(credentialId);
      if (!credential) return res.status(404).json({ message: 'Credential not found' });
  
    // Update credential details
      credential.name = name || credential.name;
      credential.url = url || credential.url;
      credential.userName = userName || credential.userName;
      credential.password = password || credential.password;
      credential.description = description || credential.description;
  
      await division.save();  // Save changes to division
      res.json(credential);

    }else{
      return res.status(400).json({ message: 'Access denied' });
    }
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a credential from a division
exports.deleteCredential = async (req, res) => {
  const { divisionId, credentialId } = req.params;
  try {
    const division = await Division.findById(divisionId);
    if (!division) return res.status(404).json({ message: 'Division not found' });

    const credential = division.repo.id(credentialId);
    if (!credential) return res.status(404).json({ message: 'Credential not found' });

    // Remove credential from division's repo
    division.repo.pull(credentialId);
    await division.save();  // Save changes to division
    res.json({ message: 'Credential deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.listAllOUs = async (req, res) => {
  try {
    const ous = await OU.find()
      .populate({
        path: 'divisions',
        select: '_id name' // Only include the _id and name fields for divisions
      })
      .exec();

    res.json(ous);
  } catch (err) {
    console.error('Error fetching OUs:', err);  // Log errors for debugging
    res.status(500).json({ message: err.message });
  }
};

exports.listAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.find({}, '_id name');
    res.json(divisions);
  } catch (err) {
    console.error('Error fetching Divisions:', err);  // Log errors for debugging
    res.status(500).json({ message: err.message });
  }
};
