import React, { useState, useEffect} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Logo from '../../img/Logo.png'

const Inventory = () => {
    const [inventory, setInventory] = useState([]);
    const [sku, Setsku] = useState('');
    const [name, Setname] = useState('');
  
    // Fetch users from Flask API
    useEffect(() => {
      axios.get('http://localhost:5000/api/inventory')
        .then(response => setInventory(response.data))
        .catch(error => console.error('Error fetching inventory:', error));
    }, []);

const deleteitem = (id) => {
  console.log('in deleteitem');
  const newInventory = inventory.filter(item => item.id !== id);
  
  //axios delete
  axios.delete(`http://localhost:5000/api/inventory/${id}`)
    .then(response => {
      console.log(response.data);
      setInventory(oldInventory => oldInventory.filter(item => item.id !== id));
    })
    .catch(error => console.error('Error removing item:', error));
};

const additem = (e) => {
    e.preventDefault();
    const newItems = { sku, name };
   
    axios.post('http://localhost:5000/api/inventory', newItems)
        .then(response => {
            console.log(response.data);
            // Ensure the response contains the newly added item with the server's generated ID
            const addedItem = { sku: response.data.sku, name: response.data.name, id: response.data.id };
            //setInventory(oldInventory => [...oldInventory, addedItem]); // Add the new item to the list
            axios.get('http://localhost:5000/api/inventory')
                .then(response => setInventory(response.data))
                .catch(error => console.error('Error re-fetching inventory:', error));
            Setsku('');
            Setname('');
        })
        .catch(error => console.error('Error adding item:', error));
      };

    return (
        <div>
          <h1>Inventory</h1>
          <ul>
            {inventory.map((item, index) => (
              <li key={index}>{item.sku} - {item.name}
              <button onClick={() => deleteitem(item.id)}>Delete</button>
              </li>
              
            ))}
          </ul>
    
          <h2>Add item</h2>
          <form onSubmit={additem}>
            <input
              type="text"
              value={sku}
              onChange={(e) => Setsku(e.target.value)}
              placeholder="sku"
              required
            />
            <input
              type="text"
              value={name}
              onChange={(e) => Setname(e.target.value)}
              placeholder="name"
              required
            />
            <button type="submit">Add item</button>
          </form>
        </div>
      );
    };


// function Inventory() {
//     return (
//         <InventoryStyled>
//             <header>
//                 <img src={Logo} alt="Logo" className="logo" />
//                 <h1 className="title">Pantry Management System (PaMS)</h1>
//             </header>
//         </InventoryStyled>
//     )
// }

const InventoryStyled = styled.div`
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
export default Inventory