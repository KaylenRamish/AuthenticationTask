const mongoose = require('mongoose');
const connectDB = require('./db');  // Import the DB connection function
const User = require('../models/User');  // Import User model
const OU = require('../models/OU');  // Import OU model
const Division = require('../models/Division');  // Import Division model
const bcrypt = require('bcryptjs');  // Library for hashing passwords
require('dotenv').config();

// Update the main function to call the new helper function after assigning users
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
  const hashedPassword = await bcrypt.hash('Password123', 10);

  // Create Users with hashed passwords
  const users = await User.insertMany([
    { email: 'manager@example.com', firstname: 'Manager', lastname: 'User', password: hashedPassword, role: 'management' },
    { email: 'user1@example.com', firstname: 'User1', lastname: 'One', password: hashedPassword, role: 'normal' },
    { email: 'user2@example.com', firstname: 'User2', lastname: 'Two', password: hashedPassword, role: 'normal' },
    { email: 'user3@example.com', firstname: 'User3', lastname: 'Three', password: hashedPassword, role: 'normal' }
  ]);

  const usersAdmin = await User.insertMany([
    { email: 'admin@example.com', firstname: 'Admin', lastname: 'User', password: hashedPassword, role: 'admin' },
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
    division.repo = repoEntries;  // Add credentials to division
    await division.save();  // Save changes to division
  }

// Assign divisions to OUs based on OU names
  for (const ou of ous) {
  // Filter divisions to include only those that match the current OU's name
  ou.divisions = allDivisions
    .filter(division => division.name.includes(ou.name)) // Check if division name includes the OU name
    .map(d => d._id); // Map to only the division IDs
  
  await ou.save(); // Save the OU with its assigned divisions
  }


const assignUsersToFirstOU = async (users, ous, allDivisions) => {
    if (ous.length === 0) {
      console.error('No OUs found to assign users to.');
      return;
    }
  
    // Get the first OU
    const firstOU = ous[0];
  
    // Find divisions belonging to the first OU
    //const ouDivisions = allDivisions.filter(d => d.ou && d.ou.equals(firstOU._id));
    const ouDivisions = firstOU.divisions;
   
    if (ouDivisions.length === 0) {
      console.error('No divisions found for the first OU:', firstOU);
      return;
    }
  
    //console.log('Divisions for the first OU:', ouDivisions);
  
    // Shuffle the divisions
    const shuffledDivisions = ouDivisions.sort(() => Math.random() - 0.5);
  
    // Assign each user to the first OU and a random division within that OU
    for (const user of users) {
      const division = shuffledDivisions.length ? shuffledDivisions.pop() : null;
  
      if (division) {
        await User.updateOne(
          { _id: user._id },
          { $set: { ou: firstOU._id, division: division._id } } // Assuming `ou` and `division` fields exist in the User model
        );
  
        // Add user to the selected Division
        await Division.updateOne(
          { _id: division._id },
          { $addToSet: { employees: user._id } } // Add user to the employees array of the Division
        );
      } else {
        console.error('No division available to assign user:', user);
      }
    }
  };

  // Add this function to assign usersAdmin to all OUs and Divisions
  const assignAdminToAllOUsAndDivisions = async (adminUser, ous, allDivisions) => {
    for (const ou of ous) {
            
      for (const division of allDivisions) {
        // Assign admin user to the OU and division
        await User.updateOne(
          { _id: adminUser._id },
          { $set: { ou: ou._id, division: division._id } } // Assuming `ou` and `division` fields exist in User model
        );

        // Add admin user to the division's employees
        await Division.updateOne(
          { _id: division._id },
          { $addToSet: { employees: adminUser._id } } // Add user to employees array of the division
        );
      }
    }
  };

  // Assign the admin user to all OUs and divisions
  await assignAdminToAllOUsAndDivisions(usersAdmin[0], ous, allDivisions);
       
  // Assign users to the first OU and random divisions within that OU
  await assignUsersToFirstOU(users, ous, allDivisions);
  

  console.log('Database seeded successfully!');
  process.exit(0);
};


seedData().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
