import React, { useEffect, useState } from 'react';
import axios from '../axios'; // Use the configured Axios instance
import { Container, Form, Button, Table, Modal, FormControl , Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RepoManagement = () => {
  const [ous, setOUs] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedOU, setSelectedOU] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [repos, setRepos] = useState([]);
  const [userRole, setUserRole] = useState('normal'); // Default role, can be updated based on actual user data
  const [editRepo, setEditRepo] = useState(null); // For storing the repo being edited
  const [showEditModal, setShowEditModal] = useState(false); // For controlling the edit modal visibility
  const [showAddModal, setShowAddModal] = useState(false); // For controlling the add modal visibility
  const [newRepo, setNewRepo] = useState({ name: '', url: '', userName: '', password: '', description: '' }); // New repo details

  // Fetch OUs on component mount
  useEffect(() => {
    const fetchOUs = async () => {
      try {
        const response = await axios.get('/api/credentials/ous');
        setOUs(response.data || []);
      } catch (error) {
        console.error('Error fetching OUs:', error);
      }
    };

    fetchOUs();
  }, []);

  // Filter divisions based on selected OU
  useEffect(() => {
    const fetchDivisionsForOU = () => {
      if (selectedOU) {
        const ou = ous.find((ou) => ou._id === selectedOU);
        setDivisions(ou ? ou.divisions : []);
      } else {
        setDivisions([]);
      }
    };

    fetchDivisionsForOU();
  }, [selectedOU, ous]);

  // Fetch repos based on selected Division
  useEffect(() => {
    const fetchRepos = async () => {
      if (selectedDivision) {
        try {
          const response = await axios.get(`/api/credentials/cred/${selectedDivision}`);
          setRepos(response.data.repo || []);
        } catch (error) {
          console.error('Error fetching repos:', error);
        }
      } else {
        setRepos([]); // Clear repos when no division is selected
      }
    };

    fetchRepos();
  }, [selectedDivision]);

  // Clear repos when division changes to avoid displaying incorrect data
  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value);
    setRepos([]); // Clear repo details immediately upon changing the division
  };

  // Fetch role based on the selected Division
  useEffect(() => {
    const fetchRole = async () => {
      if (selectedDivision) {
        try {
          const response = await axios.get(`/api/credentials/cred/${selectedDivision}`);
          const employees = response.data.employees || [];
          const userEmail = localStorage.getItem('email'); // Assuming email is stored in local storage
          if (userEmail) {
            const user = employees.find(emp => emp.email === userEmail);
            if (user) {
              setUserRole(user.role);
            } else {
              setUserRole('normal'); // Default role if email not found
            }
          }
        } catch (error) {
          console.error('Error fetching role:', error);
        }
      }
    };

    fetchRole();
  }, [selectedDivision]);

  //Handle OU change so that repo gets cleared the division gets set to no division selected
  const handleOUChange = async (event) => {
    const selectedOU = event.target.value;
    setSelectedOU(selectedOU);
    setRepos([]); // Clear the repos when OU changes
  };

  // Handle repo update
  const handleUpdateRepo = async () => {
    if (!editRepo || !selectedDivision) return;
    
    try {
      // Use both selectedDivision and editRepo._id to make the update request
      await axios.put(`/api/credentials/cred/${selectedDivision}/${editRepo._id}`, editRepo);
      setShowEditModal(false);
      // Refresh the repos list
      const response = await axios.get(`/api/credentials/cred/${selectedDivision}`);
      setRepos(response.data.repo || []);
    } catch (error) {
      console.error('Error updating repo:', error);
    }
  };

  // Handle adding new repo
  const handleAddRepo = async () => {
    if (!selectedDivision) return;
    
    try {
      await axios.post(`/api/credentials/cred/${selectedDivision}`, newRepo);
      setShowAddModal(false);
      setNewRepo({ name: '', url: '', userName: '', password: '', description: '' }); // Reset form
      // Refresh the repos list
      const response = await axios.get(`/api/credentials/cred/${selectedDivision}`);
      setRepos(response.data.repo || []);
    } catch (error) {
      console.error('Error adding repo:', error);
    }
  };

  // Open the edit modal with selected repo data
  const openEditModal = (repo) => {
    setEditRepo(repo); // Sets the full repo object including the ID
    setShowEditModal(true);
  };

  // Open the add modal
  const openAddModal = () => {
    setShowAddModal(true);
  };

  // Handle form input change for editing
  const handleInputChange = (e) => {
    setEditRepo({
      ...editRepo,
      [e.target.name]: e.target.value
    });
  };

  // Handle form input change for adding new repo
  const handleNewRepoInputChange = (e) => {
    setNewRepo({
      ...newRepo,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container>
         {/* Navigation Bar */}
         <Navbar bg="light" expand="lg">
        <Navbar.Brand>Credential Manager V1.0</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
            <Nav.Link as={Link} to="/repo-management">Repo Management</Nav.Link>
            <Nav.Link as={Link} to="/user-management">User Management</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {/* Header for part of the app you are in */}
      <h1 className="mt-5">Repo Management</h1>
      <Form>
        <Form.Group controlId="formBasicOU">
          <Form.Label>Organizational Unit</Form.Label>
          <Form.Control
            as="select"
            value={selectedOU}
            onChange={(e) => handleOUChange(e)}
          >
            <option value="">Select an OU</option>
            {ous.length > 0 ? (
              ous.map((ou) => (
                <option key={ou._id} value={ou._id}>
                  {ou.name}
                </option>
              ))
            ) : (
              <option value="">No OUs available</option>
            )}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formBasicDivision">
          <Form.Label>Division</Form.Label>
          <Form.Control
            as="select"
            value={selectedDivision}
            onChange={handleDivisionChange} // Use the new handleDivisionChange function
          >
            <option value="">Select a Division</option>
            {divisions.length > 0 ? (
              divisions.map((division) => (
                <option key={division._id} value={division._id}>
                  {division.name}
                </option>
              ))
            ) : (
              <option value="">No Divisions available</option>
            )}
          </Form.Control>
        </Form.Group>
      </Form>

      {/* Conditionally render the "Add Repo Details" button */}
      {(repos.length > 0 || userRole === 'admin') && (
        <Button className="mt-3 mb-3" onClick={openAddModal}>Add Repo Details</Button>
      )}

      <Table className="mt-3" striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>URL</th>
            <th>Username</th>
            <th>Password</th>
            {(userRole === 'management' || userRole === 'admin') && <th>Edit</th>}
          </tr>
        </thead>
        <tbody>
          {repos.length > 0 ? (
            repos.map((repo) => (
              <tr key={repo._id}>
                <td>{repo.name}</td>
                <td>{repo.description}</td>
                <td>{repo.url}</td>
                <td>{repo.userName}</td>
                <td>{repo.password}</td>
                {(userRole === 'management' || userRole === 'admin') && (
                  <td>
                    <Button onClick={() => openEditModal(repo)}>Edit</Button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={(userRole === 'normal' || userRole === 'management' || userRole === 'admin') ? 6 : 5}>
                You do not have access to this repo
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Edit Repo Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formRepoName">
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                name="name"
                value={editRepo?.name || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRepoDescription">
              <Form.Label>Description</Form.Label>
              <FormControl
                type="text"
                name="description"
                value={editRepo?.description || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRepoURL">
              <Form.Label>URL</Form.Label>
              <FormControl
                type="text"
                name="url"
                value={editRepo?.url || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRepoUsername">
              <Form.Label>Username</Form.Label>
              <FormControl
                type="text"
                name="userName"
                value={editRepo?.userName || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formRepoPassword">
              <Form.Label>Password</Form.Label>
              <FormControl
                type="password"
                name="password"
                value={editRepo?.password || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateRepo}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Repo Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Repository</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAddRepoName">
              <Form.Label>Name</Form.Label>
              <FormControl
                type="text"
                name="name"
                value={newRepo.name}
                onChange={handleNewRepoInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddRepoDescription">
              <Form.Label>Description</Form.Label>
              <FormControl
                type="text"
                name="description"
                value={newRepo.description}
                onChange={handleNewRepoInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddRepoURL">
              <Form.Label>URL</Form.Label>
              <FormControl
                type="text"
                name="url"
                value={newRepo.url}
                onChange={handleNewRepoInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddRepoUsername">
              <Form.Label>Username</Form.Label>
              <FormControl
                type="text"
                name="userName"
                value={newRepo.userName}
                onChange={handleNewRepoInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddRepoPassword">
              <Form.Label>Password</Form.Label>
              <FormControl
                type="password"
                name="password"
                value={newRepo.password}
                onChange={handleNewRepoInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddRepo}>Add Repo</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RepoManagement;
