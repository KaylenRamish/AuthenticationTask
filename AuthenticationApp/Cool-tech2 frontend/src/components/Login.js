import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // Use the configured Axios instance for HTTP requests
import { Button, Form, Container, Alert } from 'react-bootstrap'; // Import Bootstrap components for UI styling
import { toast, ToastContainer } from 'react-toastify'; // Import toast functions and container for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications

const Login = () => {
  // useState hooks to manage local state for email, password, and error message
  const [email, setEmail] = useState(''); // State for storing the email input
  const [password, setPassword] = useState(''); // State for storing the password input
  const [error, setError] = useState(''); // State for storing error messages if login fails
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the backend to authenticate the user
      const response = await axios.post('/api/auth/login', { email, password });
    
      // Save the returned JWT token and email in local storage for authentication persistence
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);
      
      // Show a success message using toast notification and redirect to the dashboard after 2 seconds
      toast.success('Login successful! Redirecting to dashboard...', {
        position: 'top-center' // Display the toast notification at the top-center of the screen
      });

      setTimeout(() => navigate('/repo-management'), 2000); // Navigate to '/repo-management' after 2 seconds
    } catch (err) {
      // Log the error to the console for debugging purposes
      console.error('Login error:', err);
      
      // Set the error state to display an error message to the user
      setError('Invalid credentials');
    }
  };

  // Function to handle navigation to the registration page
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      navigate('/Register'); // Navigate to the Register page
    } catch (err) {
      // Log the error to the console for debugging purposes
      console.error('navigation error:', err);
    }
  };
  
  return (
    <Container>
      <h1 className="mt-5">Login</h1>
      
      {/* Display an error alert if there is an error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Form for user login */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email" // Input type set to email for email validation
            placeholder="Enter email" // Placeholder text for the input field
            value={email} // Bind input value to email state
            onChange={(e) => setEmail(e.target.value)} // Update email state on input change
            required // Make this input field required
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password" // Input type set to password for password masking
            placeholder="Password" // Placeholder text for the input field
            value={password} // Bind input value to password state
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            required // Make this input field required
          />
        </Form.Group>

        {/* Submit button for login */}
        <Button variant="primary" type="submit" className="mt-3">
          Login
        </Button>
      </Form>

      {/* Form for user registration navigation */}
      <Form onSubmit={handleRegister}>
        <Button variant="primary" type="submit" className="mt-3">
          Register new User
        </Button>
      </Form>

      {/* Container for displaying toast notifications */}
      <ToastContainer />
    </Container>
  );
};

export default Login; // Export the Login component for use in other parts of the application
