import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Logo from "../../img/Logo.png";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [techid, setTechid] = useState("");
  const [role, setRole] = useState("");

  // Fetch users from Flask API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.username} - {user.techid} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

// function Members() {
//     return (
//         <MembersStyled>
//             <header>
//                 <img src={Logo} alt="Logo" className="logo" />
//                 <h1 className="title">Pantry Management System (PaMS)</h1>
//             </header>
//         </MembersStyled>
//     )
// }

const MembersStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;

  header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }

  .logo {
    width: 80px;
    height: auto;
  }

  .title {
    font-size: 2rem;
    font-weight: bold;
    color: #222260;
  }
`;
export default Users;
