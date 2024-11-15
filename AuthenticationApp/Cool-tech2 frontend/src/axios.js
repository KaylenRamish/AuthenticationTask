// src/axios.js
import axios from 'axios'; // Import the axios library for making HTTP requests

// Create an Axios instance with default configuration
const instance = axios.create({
  // Set the base URL for all requests
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000', 
  // Use REACT_APP_API_URL environment variable if available, otherwise default to 'http://localhost:5000'
});

// Add a request interceptor to attach the authorization token to headers
instance.interceptors.request.use(
  (config) => {
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Return the modified config object
    return config;
  },
  (error) => {
    // Return a rejected promise if there is an error
    return Promise.reject(error);
  }
);

// Export the configured Axios instance for use in other parts of the application
export default instance;
