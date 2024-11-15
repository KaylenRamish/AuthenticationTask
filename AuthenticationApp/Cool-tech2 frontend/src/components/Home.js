import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import './Home.css'; // Import the CSS file for styling

const Home = () => {
  const navigate = useNavigate(); // Hook for programmatic navigation

  return (
    <div className="home-container">
      <div className="overlay">
        <Container className="text-center">
          <h1 className="text-light mb-4">Welcome to my Capstone App</h1>
          <Button
            variant="primary"
            className="mx-2"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="secondary"
            className="mx-2"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default Home;
