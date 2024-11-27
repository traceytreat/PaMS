import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [techid, setTechid] = useState("");
  const [role, setRole] = useState("");

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "techid", headerName: "Tech ID", width: 150 },
    { field: "role", headerName: "Role", width: 100 },
  ];

  // Fetch users from Flask API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => {
        const dataWithIds = response.data.map((user, index) => ({
          id: index + 1, // Add an ID field for DataGrid
          ...user,
        }));
        setUsers(dataWithIds);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const addUser = (e) => {
    e.preventDefault();
    const newUser = {
      username,
      password,
      techid,
      role,
    };
    axios
      .post("http://localhost:5000/api/users", newUser)
      .then((response) => {
        const newUserWithId = {
          id: users.length + 1,
          ...newUser,
        };
        setUsers([...users, newUserWithId]);
        setUsername("");
        setPassword("");
        setTechid("");
        setRole("");
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  return (
    <UsersStyled>
      <h1>User List</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
      <div>
        <h2>Add New User</h2>
        <form onSubmit={addUser}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="text"
            value={techid}
            onChange={(e) => setTechid(e.target.value)}
            placeholder="Tech ID"
            required
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            required
          />
          <button type="submit">Add User</button>
        </form>
      </div>
    </UsersStyled>
  );
};

const UsersStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  h1 {
    margin-bottom: 1rem;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    width: 300px;
  }

  input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
`;

export default Users;
