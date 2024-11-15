import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Quagga from 'quagga';
import Logo from '../../img/Logo.png'

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [sku, Setsku] = useState('');
  const [name, Setname] = useState('');
  const [barcode, setBarcode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch users from Flask API
  useEffect(() => {
    fetchInventory();
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        Quagga.decodeSingle({
          src: e.target.result,
          numOfWorkers: 0,
          inputStream: {
            size: 800
          },
          decoder: {
            readers: ['code_128_reader', 'ean_reader', 'ean_8_reader']
          }
        }, async (result) => {
          if (result && result.codeResult) {
            setBarcode(result.codeResult.code);
            Setsku(result.codeResult.code); 
            fetchProductName(result.codeResult.code); 
          } else {
            console.error('no barcode found');
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchProductName = async (sku) => {
    setLoading(true);
    try {
      const cleanSku = sku.replace(/\s/g, '').trim();
      const response = await axios.get(`https://api.allorigins.win/raw?url=https://api.upcitemdb.com/prod/trial/lookup?upc=${cleanSku}`);
      console.log(response.data)
      if (response.data.items && response.data.items.length > 0) {
        const productName = response.data.items[0].title; // Extract product name
        Setname(productName);
      } else {
        console.log('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product name from API:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = () => {
    axios.get('http://localhost:5000/api/inventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error('Error fetching inventory:', error));
  };
  const deleteitem = (id, quantity) => {
    console.log('in deleteitem');
    const confirm = window.confirm("Delete item " + id + "?");
    if (confirm) {
      axios.delete(`http://localhost:5000/api/inventory/${id}`)
        .then(() => {
          fetchInventory();
          alert("Deleted item with ID " + id);
        })
        .catch(error => console.error('Error deleting item:', error));
    } else {
      console.log("Deletion canceled");
    }
  };

  const additem = (e) => {
    e.preventDefault();
    const newItem = { sku, name };
    axios.post('http://localhost:5000/api/inventory', newItem)
      .then(response => {
        fetchInventory();  // fetch updated inventory after adding item
        alert("Added item " + name + " with sku " + sku);
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
          <li key={index}>{item.sku} - {item.name} - Qty: {item.quantity}
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
      <div>
        Or upload an image with a barcode:<br/>
        <input type="file" onChange={handleFileUpload} />
      </div>
    </div>
  );
};

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
export default Inventory;