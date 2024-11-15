import React, { useEffect, useState } from 'react';
import axios from '../axios'; // Import the configured Axios instance for API requests
import { Container, Table, Button, Form, Dropdown, Navbar, Nav } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import default styles for React Toastify
import { Link } from 'react-router-dom';

const UserManagement = () => {
  // State hooks to manage component state
  const [users, setUsers] = useState([]); // Array of users to be displayed
  const [ous, setOUs] = useState([]); // Array of organizational units (OUs)
  const [divisions, setDivisions] = useState([]); // Array of divisions based on selected OU
  const [selectedOU, setSelectedOU] = useState(''); // Selected OU for filtering divisions and users
  const [selectedDivision, setSelectedDivision] = useState(''); // Selected Division for filtering users
  const [userDivisions, setUserDivisions] = useState({}); // Dictionary of divisions for each user

  // Fetch OUs on component mount
  useEffect(() => {
    const fetchOUs = async () => {
      try {
        const response = await axios.get('/api/credentials/ous'); // Fetch OUs from the API
        setOUs(response.data || []); // Update state with the fetched OUs
      } catch (error) {
        console.error('Error fetching OUs:', error); // Log error if fetching fails
      }
    };
    fetchOUs(); // Call fetch function
  }, []);

  // Update divisions based on selected OU
  useEffect(() => {
    if (selectedOU) {
      const ou = ous.find((ou) => ou._id === selectedOU); // Find selected OU
      setDivisions(ou ? ou.divisions : []); // Update divisions based on selected OU
    } else {
      setDivisions([]); // Clear divisions if no OU is selected
    }
  }, [selectedOU, ous]);

  // Fetch users based on selected Division
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response;
      if (selectedDivision) {
          // Fetch users by division if selected
          response = await axios.get(`/api/credentials/cred/${selectedDivision}`);
          setUsers(response.data.employees || []);
        } else if (selectedOU) {
   
          setUsers([]);
        } else {
          // Fetch all users excluding those with "admin" role
          response = await axios.get('/api/credentials/admin/users-ou-divisions');

          // Flatten and filter employees
          const filteredEmployees = response.data.flatMap(ou => 
            ou.divisions.flatMap(division => 
                division.employees.filter(employee => employee.role !== 'admin')
            )
          );
                 
          setUsers(filteredEmployees || []);
        }
        } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [selectedDivision, selectedOU]);

  // Handle OU change for the top dropdown
  const handleOUChange = (e) => {
    setSelectedOU(e.target.value); // Update selected OU state
    setSelectedDivision(''); // Clear selected division when OU changes
  };

  // Handle Division change for the top dropdown
  const handleDivisionChange = (e) => {
    setSelectedDivision(e.target.value); // Update selected division state
  };

  // Handle OU change for a specific user row
  const handleRowOUChange = async (userId, ouId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, ou: ouId, division: '' } : user // Update user OU and clear division
      )
    );

    const ou = ous.find((ou) => ou._id === ouId); // Find selected OU
    const divisions = ou ? ou.divisions : []; // Get divisions for the selected OU
    setUserDivisions((prev) => ({
      ...prev,
      [userId]: divisions, // Update user divisions state
    }));
  };

  // Handle Division change for a specific user row
  const handleRowDivisionChange = (userId, divisionId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, division: divisionId } : user // Update user division
      )
    );
  };

    // Handle user updates for OU and Division assignment
    const handleUpdateUserDivisionAssign = async (userId, ouId, divisionId) => {
      try {

        try {
          await axios.post(`/api/users/${userId}/division/${divisionId}`);
          toast.success(`Successfully assigned to Division: ${divisions.find((div) => div._id === divisionId)?.name}`);
        } catch (error) {
          console.error('Failed to update user division:', error);
          toast.error('Failed to assign user to Division');
        }
        
        // Optionally refresh the user list if needed
      } catch (error) {
        console.error('Failed to update user:', error);
      }
    };

  // Handle user updates for OU and Division unassignment
  const handleUpdateUserOUUnassign = async (userId, ouId, divisionId) => {
     //Removing the OU
     try {
         await axios.delete(`/api/users/${userId}/${ouId}`);
         toast.success(`Successfully unassigned from OU: ${ous.find((ou) => ou._id === ouId)?.name}`);
      } catch (error) {
          console.error('Failed to update user OU:', error);
          toast.error('Failed to unassign user from OU');
      }
  };

  // Handle user updates for OU and Division unassignment
  const handleUpdateUserDivisionUnassign = async (userId, ouId, divisionId) => {
     //Removing the Division
    
     try {
         await axios.delete(`/api/users/${userId}/division/${divisionId}`);
         toast.success(`Successfully unassigned from Division: ${divisions.find((div) => div._id === divisionId)?.name}`);
     } catch (error) {
         console.error('Failed to update user division:', error);
         toast.error('Failed to unassign user from Division');
     }
 };

  // Handle user role updates
  const handleUpdateUserRole = async (userId, updatedRole) => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: updatedRole }); // Update user role via API
      // Optionally refresh the user list if needed
    } catch (error) {
      console.error('Failed to update user role:', error); // Log error if role update fails
    }
  };

  // Handle role selection
  const handleRoleSelect = (userId, role) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, role } : user // Update user role in state
      )
    );
    handleUpdateUserRole(userId, role); // Make API call to update role
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

      <h1 className="mt-5">User Management</h1>

      {/* Form for selecting OU and Division */}
      <Form>
        <Form.Group controlId="formBasicOU">
          <Form.Label>Organizational Unit</Form.Label>
          <Form.Control
            as="select"
            value={selectedOU}
            onChange={handleOUChange} // Handle OU selection change
          >
            <option value="">Select an OU</option>
            {ous.map((ou) => (
              <option key={ou._id} value={ou._id}>
                {ou.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="formBasicDivision">
          <Form.Label>Division</Form.Label>
          <Form.Control
            as="select"
            value={selectedDivision}
            onChange={handleDivisionChange} // Handle Division selection change
          >
            <option value="">Select a Division</option>
            {divisions.map((division) => (
              <option key={division._id} value={division._id}>
                {division.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      {/* Table displaying users */}
      <Table className="mt-3" striped bordered hover>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>OU</th>
            <th>Division</th>
            <th>Unassign from OU and divisions</th>
            <th>Update/Add to OU and division selected</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>{user.email}</td>
              <td>
                <Dropdown onSelect={(role) => handleRoleSelect(user._id, role)}>
                  <Dropdown.Toggle variant="success" id={`dropdown-role-${user._id}`}>
                    {user.role}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="normal">Normal</Dropdown.Item>
                    <Dropdown.Item eventKey="management">Management</Dropdown.Item>
                    <Dropdown.Item eventKey="admin">Admin</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
              <td>
                <Form.Control
                  as="select"
                  value={user.ou || ''}
                  onChange={(e) => handleRowOUChange(user._id, e.target.value)}
                >
                  <option value="">Select an OU</option>
                  {ous.map((ou) => (
                    <option key={ou._id} value={ou._id}>
                      {ou.name}
                    </option>
                  ))}
                </Form.Control>
              </td>
              <td>
                <Form.Control
                  as="select"
                  value={user.division || ''}
                  onChange={(e) => handleRowDivisionChange(user._id, e.target.value)}
                >
                  <option value="">Select a Division</option>
                  {(userDivisions[user._id] || []).map((division) => (
                    <option key={division._id} value={division._id}>
                      {division.name}
                    </option>
                  ))}
                </Form.Control>
              </td>
              <td>
              <div className="button-group">
                <Button
                  variant="primary" // This will be overridden by the custom class
                  className="unassign-button"
                  onClick={() => handleUpdateUserOUUnassign(user._id, selectedOU, selectedDivision)}
                >
                  Unassign
                </Button>
              </div>
              </td>
              <td>
              <div className="button-group">
                <Button
                  variant="primary"
                  onClick={() => handleUpdateUserDivisionAssign(user._id, user.ou, user.division)}
                >
                  Assign
                </Button>
                <Button
                  variant="primary" // This will be overridden by the custom class
                  className="unassign-button"
                  onClick={() => handleUpdateUserDivisionUnassign(user._id, selectedOU, selectedDivision)}
                >
                  Unassign
                </Button>
              </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Toast Container for notifications */}
      <ToastContainer />
    </Container>
  );
};

export default UserManagement;
