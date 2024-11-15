import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // Use the configured Axios instance for making HTTP requests
import { Button, Form, Container, Alert } from 'react-bootstrap'; // Import necessary Bootstrap components for UI styling
import { toast, ToastContainer } from 'react-toastify'; // Import toast functions for notifications and ToastContainer for rendering them
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling toast notifications

const Register = () => {
  // useState hooks to manage form input states for user registration
  const [email, setEmail] = useState(''); // State to store the user's email input
  const [password, setPassword] = useState(''); // State to store the user's password input
  const [firstname, setFirstName] = useState(''); // State to store the user's first name input
  const [lastname, setLastName] = useState(''); // State to store the user's last name input
  const [error, setError] = useState(''); // State to store error messages for displaying in the UI
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to handle form submission for user registration
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the backend to register the user
      const response = await axios.post('/api/auth/register', { email, firstname, lastname, password });

      // Check if the registration was successful based on the HTTP status code
      if (response.status === 201) {
        // Show a success message using toast notification and redirect to the login page after 2 seconds
        toast.success('Registration successful! Redirecting to login...', {
          position: 'top-center' // Display the toast notification at the top-center of the screen
        });
        setTimeout(() => navigate('/login'), 2000); // Navigate to '/login' after 2 seconds
      } else {
        setError('Registration failed'); // Set an error message if registration is not successful
      }
    } catch (err) {
      // Log the error to the console for debugging purposes
      console.error('Registration error:', err.response ? err.response.data : err.message);

      // Set the error state to display an error message to the user
      setError('Registration failed');
    }
  };

  return (
    <Container>
      <h1 className="mt-5">Register</h1>

      {/* Display an error alert if there is an error */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Form for user registration */}
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

        <Form.Group controlId="formBasicFirstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text" // Input type set to text for entering first name
            placeholder="Enter first name" // Placeholder text for the input field
            value={firstname} // Bind input value to firstname state
            onChange={(e) => setFirstName(e.target.value)} // Update firstname state on input change
            required // Make this input field required
          />
        </Form.Group>

        <Form.Group controlId="formBasicLastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text" // Input type set to text for entering last name
            placeholder="Enter last name" // Placeholder text for the input field
            value={lastname} // Bind input value to lastname state
            onChange={(e) => setLastName(e.target.value)} // Update lastname state on input change
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

        {/* Submit button for registration */}
        <Button variant="primary" type="submit" className="mt-3">
          Register
        </Button>
      </Form>

      {/* Container for displaying toast notifications */}
      <ToastContainer />
    </Container>
  );
};

export default Register; // Export the Register component for use in other parts of the application
