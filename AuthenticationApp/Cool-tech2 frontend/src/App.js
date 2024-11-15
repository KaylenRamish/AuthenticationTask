import React from 'react'; // Import React to use JSX syntax and create components
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route from react-router-dom for routing
import Login from './components/Login'; // Import the Login component
import Register from './components/Register'; // Import the Register component
import Home from './components/Home'; // Import the Home component
import RepoManagement from './components/RepoManagement'; // Import the RepoManagement component
import UserManagement from './components/UserManagement'; // Import the UserManagement component
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS for styling

// Main App component
function App() {
  return (
    <Routes>
      {/* Define routes for different components */}
      <Route path="/" element={<Home />} />
       {/* The Home route */}
      <Route path="/login" element={<Login />} />
      {/* Route for the login page */}
      <Route path="/register" element={<Register />} />
      {/* Route for the registration page */}
      <Route path="/repo-management" element={<RepoManagement />} />
      {/* Route for the repository management page */}
      <Route path="/user-management" element={<UserManagement />} />
      {/* Route for the user management page */}
    </Routes>
  );
}

export default App; // Export the App component for use in other parts of the application
