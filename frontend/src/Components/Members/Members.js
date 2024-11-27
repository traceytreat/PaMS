import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [firstname, SetFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [techid, setTechid] = useState("");
  const [address, setAdress] = useState("");
  const [minors, SetMinors] = useState("");
  const [adults, setAdults] = useState("");
  const [seniors, setSeniors] = useState("");

  // Define columns for the DataGrid
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "techid", headerName: "Tech ID", width: 100 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "minors", headerName: "Minors", type: "number", width: 100 },
    { field: "adults", headerName: "Adults", type: "number", width: 100 },
    { field: "seniors", headerName: "Seniors", type: "number", width: 100 },
    { field: "intakedate", headerName: "Intake Date", width: 150 },
  ];

  // Fetch users from Flask API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/members")
      .then((response) => {
        const dataWithIds = response.data.map((member, index) => ({
          id: index + 1, // Add an ID field for DataGrid
          ...member,
        }));
        setMembers(dataWithIds);
      })
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  const addMember = (e) => {
    e.preventDefault();
    const newMember = {
      firstname,
      lastname,
      techid,
      address,
      minors,
      adults,
      seniors,
    };

    axios
      .post("http://localhost:5000/api/members", newMember)
      .then((response) => {
        const newMemberWithId = {
          id: members.length + 1,
          ...newMember,
          intakedate: new Date().toISOString().split("T")[0], // Example intake date
        };
        setMembers([...members, newMemberWithId]); // Add the new user to the list
        SetFirstname("");
        setLastname("");
        setTechid("");
        setAdress("");
        SetMinors("");
        setAdults("");
        setSeniors("");
      })
      .catch((error) => console.error("Error adding user:", error));
  };

  return (
    <MembersStyled>
      <h1>Member List</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={members}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
        />
      </div>
      <h2>Add Member</h2>
      <form onSubmit={addMember}>
        <input
          type="text"
          value={firstname}
          onChange={(e) => SetFirstname(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          placeholder="Last Name"
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
          value={address}
          onChange={(e) => setAdress(e.target.value)}
          placeholder="Address"
          required
        />
        <input
          type="number"
          value={minors}
          onChange={(e) => SetMinors(e.target.value)}
          placeholder="Minors"
          required
        />
        <input
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          placeholder="Adults"
          required
        />
        <input
          type="number"
          value={seniors}
          onChange={(e) => setSeniors(e.target.value)}
          placeholder="Seniors"
          required
        />
        <button type="submit">Add Member</button>
      </form>
    </MembersStyled>
  );
};

const MembersStyled = styled.div`
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

export default Members;
