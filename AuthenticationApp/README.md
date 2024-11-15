# Credential Manager V1.0

Credential Manager V1.0 is a web application designed to manage user credentials, organizational units (OUs), and divisions. It features user management and repository management functionalities, with authentication and role-based access control.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Features

- **User Management**: 
  - View and manage users, including assigning and unassigning users to organizational units and divisions.
  - Update user roles and credentials.
  
- **Repository Management**:
  - Manage repositories associated with organizational units and divisions.

- **Authentication**:
  - User registration and login with JWT-based authentication.

## Installation

1. **Clone the repository:**

   ```bash
    git clone https://github.com/KaylenRamish/AuthenticationTask
    Navigate into the project directory:

    
    Open up Cool-Tech2 frontend
    Install dependencies
    npm install
    npm start 

    There is already a created .env file for both the front end and backend
    Ensure that your login details for the backend is replaced with your own for Atlas online

    Navigate into the project directory:
   
    Open up Cool-Tech2 backend
    Install dependencies
    npm install   

    Run the application backend:
    npm node seed.js
    npm node App.js


    Usage
    Login:

    Navigate to /login to access the login page.
    Register:

    Navigate to /register to create a new account.
    User Management:

    Navigate to /user-management to manage users, including assigning and unassigning organizational units and divisions.
    Repository Management:

    Navigate to /repo-management to manage repositories.


    Folder Structure
    The project directory structure is as follows:

    /src
    /components
        Login.js
        Register.js
        RepoManagement.js
        UserManagement.js
    App.js
    axios.js
    index.js
    Login.js: Handles user login functionality.
    Register.js: Handles user registration functionality.
    RepoManagement.js: Manages repositories associated with OUs and divisions.
    UserManagement.js: Manages user details, roles, and assignments.
    App.js: Defines the main routing structure of the application.
    axios.js: Configures Axios for HTTP requests with authorization token handling.

    API Endpoints
    Ensure your backend server is running at the specified REACT_APP_API_URL. The frontend communicates with the following endpoints:

    Login: POST /api/auth/login
    Register: POST /api/auth/register
    Get OUs: GET /api/credentials/ous
    Get Users by Division: GET /api/credentials/cred/:divisionId
    Update User Role: PUT /api/users/:userId/role
    Update User Division: POST /api/users/:userId/division/:divisionId
    Unassign User from OU: DELETE /api/users/:userId/:ouId
    Unassign User from Division: DELETE /api/users/:userId/division/:divisionId
    License
    This project is licensed under the MIT License. See the LICENSE file for details.



### Explanation:

1. **Introduction:** Provides an overview of the application and its purpose.
2. **Features:** Lists the main features of the application.
3. **Installation:** Step-by-step guide to set up the project locally.
4. **Usage:** Instructions on how to use the different parts of the application.
5. **Folder Structure:** Overview of the project's directory layout and the purpose of key files.
6. **API Endpoints:** Documentation of the API endpoints the frontend interacts with.
7. **License:** Information on the project's license.

