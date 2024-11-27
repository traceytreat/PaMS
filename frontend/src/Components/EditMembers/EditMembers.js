import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

const EditMembers = () => {
  const [member, setMember] = useState([]);
  const [members, setMembers] = useState([]);
  const [firstname, SetFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [techid, setTechid] = useState("");
  const [address, setAddress] = useState("");
  const [minors, SetMinors] = useState("");
  const [adults, setAdults] = useState("");
  const [seniors, setSeniors] = useState("");
  const [memberidLookup, setMemberid] = useState("");

  // Fetch members from Flask API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/members")
      .then((response) => setMembers(response.data))
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  const handleId = (event) => {
    setMemberid(event.target.value);
  };

  const handleSearch = () => {
    axios
      .get("http://localhost:5000/api/member", {
        params: { memberid: memberidLookup },
      })
      .then((response) => {
        setMember(response.data);
        SetFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setAddress(response.data.address);
        setTechid(response.data.techid);
        SetMinors(response.data.minors);
        setAdults(response.data.adults);
        setSeniors(response.data.seniors);
      })
      .catch((error) => console.error("Error fetching member:", error));
  };

  const editMember = (e) => {
    e.preventDefault();
    const updatedMember = {
      firstname,
      lastname,
      techid,
      address,
      minors,
      adults,
      seniors,
    };
    axios
      .put(`http://localhost:5000/api/members/${memberidLookup}`, updatedMember)
      .then(() => alert("Member updated successfully!"))
      .catch((error) => console.error("Error updating member:", error));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Edit Members
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select a Member</InputLabel>
        <Select value={memberidLookup} onChange={handleId}>
          <MenuItem value="" disabled>
            Select a Member
          </MenuItem>
          {members.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.firstname + " " + member.lastname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        onClick={handleSearch}
        sx={{ mb: 3 }}
      >
        Lookup Member
      </Button>
      <Box
        component="form"
        onSubmit={editMember}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
        }}
      >
        <TextField
          label="First Name"
          value={firstname}
          onChange={(e) => SetFirstname(e.target.value)}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          fullWidth
        />
        <TextField
          label="Tech ID"
          value={techid}
          onChange={(e) => setTechid(e.target.value)}
          fullWidth
        />
        <TextField
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          fullWidth
        />
        <TextField
          label="Minors (0-17)"
          type="number"
          value={minors}
          onChange={(e) => SetMinors(e.target.value)}
          fullWidth
        />
        <TextField
          label="Adults (18-64)"
          type="number"
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
          fullWidth
        />
        <TextField
          label="Seniors (65+)"
          type="number"
          value={seniors}
          onChange={(e) => setSeniors(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" type="submit">
          Update Member
        </Button>
      </Box>
    </Box>
  );
};

export default EditMembers;
