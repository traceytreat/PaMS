import React, { useState, useEffect} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Logo from '../../img/Logo.png'

const Members = () => {
    const [members, setMembers] = useState([]);
    const [firstname, SetFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [techid, setTechid] = useState('');
    const [address, setAdress] = useState();
    const [minors, SetMinors] = useState('');
    const [adults, setAdults] = useState('');
    const [seniors, setSeniors] = useState('');
    const [intakedate, setIntakedate] = useState('');
  
    // Fetch users from Flask API
    useEffect(() => {
      axios.get('http://localhost:5000/api/members')
        .then(response => setMembers(response.data))
        .catch(error => console.error('Error fetching members:', error));
    }, []);

const addMember = (e) => {
    e.preventDefault();
    const newMembers = { firstname, lastname, techid, address, minors, adults, seniors, intakedate};
   
    axios.post('http://localhost:5000/api/members', newMembers)
        .then(response => {
        console.log(response.data);
        setMembers([...members, newMembers]);  // Add the new user to the current list
        SetFirstname('');
        setLastname('');
        
        })
        .catch(error => console.error('Error adding user:', error));
    };

    return (
        <div>
          <h1>Member List</h1>
          <ul>
            {members.map((member, index) => (
              <li key={index}>{member.firstname} - {member.lastname} - {member.techid} - {member.address} - {member.minors} - {member.adults} - {member.seniors} - {member.intakedate}</li>
            ))}
          </ul>
    
          <h2>Add Member</h2>
          <form onSubmit={addMember}>
            <input
              type="text"
              value={firstname}
              onChange={(e) => SetFirstname(e.target.value)}
              placeholder="Firstname"
              required
            />
            <input
              type="Lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Lastname"
              required
            />
            <input
              type="techid"
              value={techid}
              onChange={(e) => setTechid(e.target.value)}
              placeholder="Tech id"
              required
            />
            <input
              type="address"
              value={address}
              onChange={(e) => setAdress(e.target.value)}
              placeholder="Address"
              required
            />
            <input
              type="minors"
              value={minors}
              onChange={(e) => SetMinors(e.target.value)}
              placeholder="Minors"
              required
            />
            <input
              type="adults"
              value={adults}
              onChange={(e) => setAdults(e.target.value)}
              placeholder="Adults"
              required
            />
            <input
              type="seniors"
              value={seniors}
              onChange={(e) => setSeniors(e.target.value)}
              placeholder="seniors"
              required
            />
            <button type="submit">Add member</button>
          </form>
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
`
export default Members