import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Logo from "../../img/Logo.png";

const EditMembers = () => {
  const [member, setMember] = useState([]);
  const [members, setMembers] = useState([]);
  const [firstname, SetFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [techid, setTechid] = useState("");
  const [address, setAdress] = useState("");
  const [minors, SetMinors] = useState("");
  const [adults, setAdults] = useState("");
  const [seniors, setSeniors] = useState("");
  const [memberidLookup, setMemberid] = useState("");
  // Fetch users from Flask API
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
      .then((response) => {setMember(response.data);
        SetFirstname(response.data.firstname);
        setLastname(response.data.lastname);
        setAdress(response.data.address);
        setTechid(response.data.techid);
        SetMinors(response.data.minors);
        setAdults(response.data.adults);
        setSeniors(response.data.seniors);
      })
      .catch((error) => console.error("Error fetching members:", error));
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
    axios.put(
      "http://localhost:5000/api/members/" + memberidLookup,
      updatedMember
    );
  };

  return (
    <div>
      <select value={memberidLookup} onChange={handleId}>
        <option value="" disabled>
          Select a Member
        </option>
        {members.map((member, index) => (
          <option key={index} value={member.id}>
            {member.firstname + " " + member.lastname}
          </option>
        ))}
      </select>
      {/* <input type="text" value={memberidLookup} onChange={handleId}></input> */}
      <button onClick={handleSearch}>Lookup member</button>
      <h1>Member List</h1>
      <input
        value={firstname}
        onChange={(e) => SetFirstname(e.target.value)}
      ></input>
      <input
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
      ></input>
      <input value={techid} onChange={(e) => setTechid(e.target.value)}></input>
      <input
        value={address}
        onChange={(e) => setAdress(e.target.value)}
      ></input>
      <input value={minors} onChange={(e) => SetMinors(e.target.value)}></input>
      <input value={adults} onChange={(e) => setAdults(e.target.value)}></input>
      <input
        value={seniors}
        onChange={(e) => setSeniors(e.target.value)}
      ></input>
      <button onClick={editMember}>Edit member</button>
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
export default EditMembers;
