const mongoose = require('mongoose');
const connectDB = require('./db');  // Import the DB connection function
const User = require('../models/User');  // Import User model
const OU = require('../models/OU');  // Import OU model
const Division = require('../models/Division');  // Import Division model
const bcrypt = require('bcryptjs');  // Library for hashing passwords

const seedData = async () => {
  await connectDB();  // Connect to the database
  
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

  // Create Divisions and link them to OUs
  const divisions = await Division.insertMany([
    { name: 'Finance', ou: ous[0]._id },
    { name: 'IT', ou: ous[0]._id },
    { name: 'Writing', ou: ous[0]._id },
    { name: 'Development', ou: ous[1]._id },
    { name: 'HR', ou: ous[1]._id },
    { name: 'Operations', ou: ous[2]._id },
    { name: 'Cleaning', ou: ous[2]._id },
    { name: 'Catering', ou: ous[3]._id },
    { name: 'Logistics', ou: ous[3]._id },
    { name: 'Fraud monitoring', ou: ous[3]._id }
  ]);

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

  for (const division of divisions) {
    division.repo = repoEntries;  // Add credentials to division
    await division.save();  // Save changes to division
  }

    // Assign divisions to OUs
    for (const ou of ous) {
      ou.divisions = divisions.map(d => d._id);
      await ou.save();
    }

  // Assign users to divisions
  const userDivisionsMapping = {
    'admin@example.com': divisions[0]._id,
    'manager@example.com': divisions[3]._id,
    'user1@example.com': divisions[5]._id,
    'user2@example.com': divisions[7]._id,
    'user3@example.com': divisions[1]._id
  };
  
  for (const user of users) {
    const divisionId = userDivisionsMapping[user.email];
    if (divisionId) {
      await Division.updateOne(
        { _id: divisionId },
        { $addToSet: { employees: user._id } }
      );
    }
  }

  console.log('Database seeded successfully!');
  process.exit(0);
};

seedData().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
