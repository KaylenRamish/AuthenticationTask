const mongoose = require('mongoose');
const connectDB = require('./db'); // Import the DB connection function
const User = require('../models/User'); // Import User model
const OU = require('../models/OU'); // Import OU model
const Division = require('../models/Division'); // Import Division model
const bcrypt = require('bcryptjs'); // Library for hashing passwords

const seedData = async () => {
  await connectDB(); // Connect to the database

  // Clear existing data in collections
  await User.deleteMany({});
  await OU.deleteMany({});
  await Division.deleteMany({});

  // Create Organizational Units (OUs)
  const ous = await OU.insertMany([
    { name: 'News management' },
    { name: 'Software reviews' },
    { name: 'Hardware reviews' },
    { name: 'Opinion publishing' }
  ]);

  // Base names for generating unique division names
  const baseDivisionNames = [
    'Finance', 'IT', 'Writing', 'Development', 'HR', 'Operations', 
    'Cleaning', 'Catering', 'Logistics', 'Fraud monitoring'
  ];

  // Create Divisions for each OU with globally unique names
  const allDivisions = [];
  for (const ou of ous) {
    const divisions = baseDivisionNames.map(baseName => ({
      name: `${baseName} - ${ou.name}`, // Make name unique by appending OU name
      ou: ou._id
    }));
    const createdDivisions = await Division.insertMany(divisions);
    allDivisions.push(...createdDivisions);
  }

  // Hash passwords for users
  const hashedPassword = await bcrypt.hash('password', 10);

  // Create Users with hashed passwords
  const users = await User.insertMany([
    { email: 'admin@example.com', firstname: 'Admin', lastname: 'User', password: hashedPassword, role: 'admin' },
    { email: 'manager@example.com', firstname: 'Manager', lastname: 'User', password: hashedPassword, role: 'management' },
    { email: 'user1@example.com', firstname: 'User1', lastname: 'One', password: hashedPassword, role: 'normal' },
    { email: 'user2@example.com', firstname: 'User2', lastname: 'Two', password: hashedPassword, role: 'normal' },
    { email: 'user3@example.com', firstname: 'User3', lastname: 'Three', password: hashedPassword, role: 'normal' }
  ]);

  // Add example credentials to each division
  const repoEntries = [
    { name: 'Netflix', url: 'https://www.netflix.com', userName: 'mynetflix', password: 'Password123', description: 'Netflix login details' },
    { name: 'Gmail', url: 'https://mail.google.com', userName: 'myemail', password: 'Email123', description: 'Gmail login details' },
    { name: 'AWS', url: 'https://aws.amazon.com', userName: 'myaws', password: 'Aws123', description: 'AWS login details' },
    { name: 'GitHub', url: 'https://github.com', userName: 'mygithub', password: 'GitHub123', description: 'GitHub login details' },
    { name: 'Facebook', url: 'https://www.facebook.com', userName: 'myfacebook', password: 'Facebook123', description: 'Facebook login details' }
  ];

  for (const division of allDivisions) {
    division.repo = repoEntries; // Add credentials to division
    await division.save(); // Save changes to division
  }

  // Assign divisions to OUs
  for (const ou of ous) {
    const ouDivisions = allDivisions
      .filter(d => d.ou && d.ou.toString() === ou._id.toString()) // Ensure d.ou is not undefined
      .map(d => d._id);
    ou.divisions = ouDivisions;
    await ou.save();
  }

  // Randomly assign users to divisions within their OUs
  for (const user of users) {
    const randomDivision = allDivisions[Math.floor(Math.random() * allDivisions.length)];
    await Division.updateOne(
      { _id: randomDivision._id },
      { $addToSet: { employees: user._id } }
    );
  }

  console.log('Database seeded successfully!');
  process.exit(0);
};

seedData().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
